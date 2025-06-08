// Import tất cả models để register chúng với Mongoose
import User from './models/user.model'
import Product from './models/product.model'
import Review from './models/review.model'
import Order from './models/order.model'
import Setting from './models/setting.model'
import WebPage from './models/web-page.model'

// Tạo function để đảm bảo tất cả models được register
export const registerModels = () => {
  // Models đã được register khi import
  console.log('Models registered:', {
    User: User.modelName,
    Product: Product.modelName,
    Review: Review.modelName,
    Order: Order.modelName,
    Setting: Setting.modelName,
    WebPage: WebPage.modelName,
  })
}

// Export các models để sử dụng
export {
  User,
  Product,
  Review,
  Order,
  Setting,
  WebPage,
}

export default {
  User,
  Product,
  Review,
  Order,
  Setting,
  WebPage,
}