import { Hono } from 'hono';
import { UserController } from '../internal/users/user/user.controller.js';




export class PublicRoute  {
    public app: Hono;

    constructor() {
        this.app = new Hono();
        this.routes();
  }

  private routes() {
    this.app.route('/api', UserController);
  }
}