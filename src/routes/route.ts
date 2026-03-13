import { Hono } from 'hono';
import { UserController } from '../internal/users/user/user.controller.js';
import { ProductController } from '../internal/products/product.controller.js';
import { CategoryController } from '../internal/categories/category.controller.js';
import { MembershipController } from '../internal/users/membership/membership.controller.js';
import { LikeController } from '../internal/users/like/like.controller.js';
import { FavouriteController } from '../internal/users/favourite/favourite.controller.js';

export class PublicRoute  {
    public app: Hono;

    constructor() {
        this.app = new Hono();
        this.routes();
  }

  private routes() {
    this.app.route('/api', UserController);
    this.app.route('/api', ProductController)
    this.app.route('/api', CategoryController)
    this.app.route('/api', MembershipController)
    this.app.route('/api', LikeController)
    this.app.route('/api', FavouriteController)
  }
}