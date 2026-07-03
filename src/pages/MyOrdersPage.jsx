import Header from '../components/Header'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import products from '../products.json'
import { resolveImage } from '../utils/imageMap'

// MyPage 주문 현황 카운트(결제완료 1, 배송중 1, 배송완료 3, 반품 1)와 맞춘 목업 주문
const ORDERS = [
  { orderNum: 'BW-25070201', date: '2026-07-02', status: '결제완료', productId: 2,  qty: 1 },
  { orderNum: 'BW-25062801', date: '2026-06-28', status: '배송중',   productId: 6,  qty: 1 },
  { orderNum: 'BW-25062101', date: '2026-06-21', status: '배송완료', productId: 1,  qty: 1 },
  { orderNum: 'BW-25061502', date: '2026-06-15', status: '배송완료', productId: 10, qty: 2 },
  { orderNum: 'BW-25060901', date: '2026-06-09', status: '배송완료', productId: 12, qty: 1 },
  { orderNum: 'BW-25060302', date: '2026-06-03', status: '반품',     productId: 19, qty: 1 },
]

const STATUS_COLOR = {
  '결제완료': '#094089',
  '배송중':   '#0b7a3e',
  '배송완료': '#555',
  '반품':     '#e03131',
}

export default function MyOrdersPage() {
  const navigate = useNavigate()

  return (
    <div className="page-root">
      <Header showBack title="주문내역" />
      <div className="page-scroll">
        <div style={{ padding: '16px' }}>
          {ORDERS.map(order => {
            const product = products.find(p => p.id === order.productId)
            if (!product) return null
            return (
              <div key={order.orderNum} style={{
                background: '#fff', border: '1px solid #f0f0f0', borderRadius: '12px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: '10px', padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#999' }}>{order.date} · {order.orderNum}</span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: STATUS_COLOR[order.status] }}>{order.status}</span>
                </div>
                <div
                  onClick={() => navigate(`/products/${product.id}`)}
                  style={{ display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer' }}
                >
                  <img
                    src={resolveImage(product.image)}
                    alt={product.name}
                    style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', background: '#f5f5f5', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.name}
                    </p>
                    <p style={{ fontSize: '11px', color: '#aaa', marginTop: '3px' }}>수량 {order.qty}개</p>
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#111', flexShrink: 0 }}>
                    {(product.salePrice * order.qty).toLocaleString()}원
                  </p>
                </div>
              </div>
            )
          })}
          <p style={{ fontSize: '11px', color: '#bbb', textAlign: 'center', padding: '12px 0 4px' }}>
            최근 3개월간의 주문 내역입니다.
          </p>
        </div>
        <Footer />
      </div>
    </div>
  )
}
