import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCategoryBar from '../components/ProductCategoryBar'
import FilterChipsBar from '../components/FilterChipsBar'

import img1 from '../assets/images/Product/mcLaren edition/Product_mcLaren edition_01.jpg'
import img2 from '../assets/images/Product/mcLaren edition/Product_mcLaren edition_02.jpg'
import img3 from '../assets/images/Product/mcLaren edition/Product_mcLaren edition_03.jpg'

const IMAGES = [img1, img2, img3]

export default function McLarenEditionPage() {
  return (
    <div className="page-root">
      <Header showBack title="맥라렌 에디션" />
      <div className="page-scroll">
        <ProductCategoryBar />
        <FilterChipsBar />
        <div style={{ padding: '20px 16px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {IMAGES.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`맥라렌 에디션 ${i + 1}`}
                style={{ width: '100%', borderRadius: '8px', display: 'block', objectFit: 'cover', aspectRatio: '1 / 1' }}
              />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
