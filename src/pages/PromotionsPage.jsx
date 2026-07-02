import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCategoryBar from '../components/ProductCategoryBar'
import FilterChipsBar from '../components/FilterChipsBar'

import img01 from '../assets/images/Product/promotions/Product_promotions_01.jpg'
import img02 from '../assets/images/Product/promotions/Product_promotions_02.jpg'
import img03 from '../assets/images/Product/promotions/Product_promotions_03.jpg'
import img04 from '../assets/images/Product/promotions/Product_promotions_04.jpg'
import img05 from '../assets/images/Product/promotions/Product_promotions_05.jpg'
import img06 from '../assets/images/Product/promotions/Product_promotions_06.jpg'
import img07 from '../assets/images/Product/promotions/Product_promotions_07.jpg'
import img08 from '../assets/images/Product/promotions/Product_promotions_08.jpg'
import img09 from '../assets/images/Product/promotions/Product_promotions_09.jpg'
import img10 from '../assets/images/Product/promotions/Product_promotions_10.jpg'
import img11 from '../assets/images/Product/promotions/Product_promotions_11.jpg'
import img12 from '../assets/images/Product/promotions/Product_promotions_12.jpg'
import img13 from '../assets/images/Product/promotions/Product_promotions_13.jpg'
import img14 from '../assets/images/Product/promotions/Product_promotions_14.jpg'
import img15 from '../assets/images/Product/promotions/Product_promotions_15.jpg'
import img16 from '../assets/images/Product/promotions/Product_promotions_16.jpg'
import img17 from '../assets/images/Product/promotions/Product_promotions_17.jpg'

const IMAGES = [img01,img02,img03,img04,img05,img06,img07,img08,img09,img10,img11,img12,img13,img14,img15,img16,img17]

export default function PromotionsPage() {
  return (
    <div className="page-root">
      <Header showBack title="프로모션" />
      <div className="page-scroll">
        <ProductCategoryBar />
        <FilterChipsBar />
        <div style={{ padding: '20px 16px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {IMAGES.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`프로모션 ${i + 1}`}
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
