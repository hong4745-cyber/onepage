import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MenuProvider } from './context/MenuContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { SearchProvider } from './context/SearchContext'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CompanyIntroPage from './pages/CompanyIntroPage'
import FaqPage from './pages/FaqPage'
import EmptyPage from './pages/EmptyPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import MyPage from './pages/MyPage'
import McLarenEditionPage from './pages/McLarenEditionPage'
import PromotionsPage from './pages/PromotionsPage'
import ReviewsPage from './pages/ReviewsPage'
import NoticePage from './pages/NoticePage'
import QnaPage from './pages/QnaPage'
import WishlistPage from './pages/WishlistPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderCompletePage from './pages/OrderCompletePage'
import SuccessPage from './pages/SuccessPage'
import MyOrdersPage from './pages/MyOrdersPage'
import CouponsPage from './pages/CouponsPage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <CartProvider>
      <WishlistProvider>
      <SearchProvider>
      <MenuProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/company" element={<CompanyIntroPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/special" element={<McLarenEditionPage />} />
          <Route path="/promotions" element={<PromotionsPage />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/qna" element={<QnaPage />} />
          <Route path="/events" element={<EmptyPage title="이벤트" boardTabs />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<EmptyPage title="회원가입" />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-complete" element={<OrderCompletePage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />
          <Route path="/coupons" element={<CouponsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
      </MenuProvider>
      </SearchProvider>
      </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  )
}
