import { Hono } from 'hono';
import { GoogleController } from './google.controller.js';

export class GoogleRoute  {
    public app: Hono;

    constructor() {
        this.app = new Hono();
        this.routes();
  }

  private routes() {
   this.app.route('/', GoogleController)
  }
}