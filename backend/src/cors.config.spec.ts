import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { createCorsOptions, parseCorsOrigins } from './cors.config';

@Controller('test')
class TestController {
  @Get()
  get(): string {
    return 'ok';
  }
}

describe('CORS configuration', () => {
  describe('parseCorsOrigins', () => {
    it('parses trimmed, comma-separated exact HTTP(S) origins', () => {
      expect(
        parseCorsOrigins(
          'http://localhost:5173, https://admin.example.test:8443',
        ),
      ).toEqual(['http://localhost:5173', 'https://admin.example.test:8443']);
    });

    it.each([undefined, '', '   '])('rejects a missing value (%p)', (value) => {
      expect(() => parseCorsOrigins(value)).toThrow(/CORS_ORIGINS/);
    });

    it.each([
      'https://example.test,',
      'not-a-url',
      'ftp://example.test',
      'https://user@example.test',
      'https://example.test/path',
      'https://example.test?query=true',
      'https://example.test#fragment',
      'https://example.test/',
      'https://example.test:443',
      'https://example.test,https://example.test',
    ])('rejects invalid or ambiguous configuration %p', (value) => {
      expect(() => parseCorsOrigins(value)).toThrow(/CORS_ORIGINS/);
    });
  });

  describe('Nest CORS middleware', () => {
    let app: INestApplication<App>;

    beforeEach(async () => {
      const module = await Test.createTestingModule({
        controllers: [TestController],
      }).compile();

      app = module.createNestApplication();
      app.enableCors(createCorsOptions('https://frontend.example.test'));
      await app.init();
    });

    afterEach(async () => {
      await app.close();
    });

    it('permits configured-origin preflights for current API access', async () => {
      const response = await request(app.getHttpServer())
        .options('/test')
        .set('Origin', 'https://frontend.example.test')
        .set('Access-Control-Request-Method', 'PATCH')
        .set('Access-Control-Request-Headers', 'Authorization, Content-Type')
        .expect(204);

      expect(response.headers['access-control-allow-origin']).toBe(
        'https://frontend.example.test',
      );
      expect(response.headers['access-control-allow-methods']).toBe(
        'GET,POST,PATCH',
      );
      expect(response.headers['access-control-allow-headers']).toBe(
        'Authorization,Content-Type',
      );
      expect(
        response.headers['access-control-allow-credentials'],
      ).toBeUndefined();
    });

    it('does not grant an unlisted origin cross-origin access', async () => {
      const response = await request(app.getHttpServer())
        .get('/test')
        .set('Origin', 'https://unlisted.example.test')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeUndefined();
    });
  });
});
