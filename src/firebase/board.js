import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db, firebaseReady } from '../firebase'

// 게시판 컬렉션(공지사항/리뷰/상품문의/이벤트) 실시간 구독. 최신순 정렬.
export function subscribeBoardPosts(collectionName, onData, onError) {
  if (!firebaseReady) {
    onData([])
    return () => {}
  }
  const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'))
  return onSnapshot(
    q,
    snapshot => {
      const posts = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          date: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        }
      })
      onData(posts)
    },
    onError,
  )
}

export async function addBoardPost(collectionName, data, user) {
  if (!firebaseReady) throw new Error('Firebase 설정이 완료되지 않아 등록할 수 없습니다.')
  return addDoc(collection(db, collectionName), {
    ...data,
    authorId: user.uid,
    authorEmail: user.email,
    createdAt: serverTimestamp(),
  })
}

// 카테고리 / 기간 / 검색어(제목·내용) 클라이언트 필터링
export function filterPosts(posts, { category, categoryField = 'category', periodDays, keyword, searchBy = '제목' } = {}) {
  let result = posts

  if (category && category !== '전체') {
    result = result.filter(p => p[categoryField] === category)
  }

  if (periodDays && periodDays !== Infinity) {
    const cutoff = Date.now() - periodDays * 24 * 60 * 60 * 1000
    result = result.filter(p => p.date.getTime() >= cutoff)
  }

  const trimmed = keyword?.trim()
  if (trimmed) {
    const needle = trimmed.toLowerCase()
    result = result.filter(p => {
      const haystack =
        searchBy === '내용' ? p.content :
        searchBy === '작성자' ? (p.authorEmail || '') :
        p.title
      return (haystack || '').toLowerCase().includes(needle)
    })
  }

  return result
}

export const PERIOD_DAYS = {
  '일주일': 7,
  '1개월': 30,
  '3개월': 90,
  '전체': Infinity,
}
