# Bowers & Wilkins 쇼핑몰 클론 코딩 — PPT 기획서

> 표지의 제작기간·제작자명은 실제 값으로 교체해주세요 (git 로그 기준 임시값 사용).

---

## 1. 표지
- **프로젝트명**: Bowers & Wilkins 쇼핑몰 클론 코딩 — 프리미엄 오디오 브랜드 이커머스 UI/UX 구현
- **제작자**: Back-jieun *(git commit author 기준 — 실명으로 교체 가능)*
- **제작기간**: 2026-07-03 *(git 로그가 하루 안에 몰려있음 — 실제 작업 시작일이 더 이전이면 정정 필요)*

---

## 2. 프로젝트 개요
- **왜 이 프로젝트인가**: 상품 탐색 → 장바구니 → 결제 → 주문완료로 이어지는 커머스 플로우를 처음부터 끝까지 직접 구현해, 라우팅 / 상태관리 / 외부 API 연동 / 배포까지 아우르는 프론트엔드 실무 역량을 증명
- **왜 B&W인가**: 실제 존재하는 프리미엄 오디오 브랜드를 레퍼런스로 삼아 고급스러운 톤앤매너 UI와, 색상 / 카테고리 등 복잡한 상품 옵션 데이터 모델링을 연습
- **차별점**: 단순 정적 클론이 아니라 Polar.sh 실 결제 연동, 서버리스 프록시, Three.js 커스텀 셰이더 등 "실무에서 실제로 부딪히는 문제"를 의도적으로 끌어들여 트러블슈팅 경험을 쌓는 것이 목적

---

## 3. 기술 스택

| 영역 | 기술 |
|---|---|
| Frontend | React 19, React Router DOM 7 (SPA) |
| Build | Vite 8 (dev proxy, env 분리) |
| 상태관리 | Context API 4개 도메인 분리 (Cart / Wishlist / Search / Menu) |
| 애니메이션 | GSAP, Motion(Framer Motion), Three.js(커스텀 GLSL 셰이더) |
| 아이콘 | FontAwesome, react-icons |
| 결제 | Polar.sh API (실 결제 연동, 서버리스 프록시) |
| 인증 / DB | Firebase Authentication(이메일·구글), Cloud Firestore(게시판 실시간 CRUD) |
| 배포 | Vercel(서버리스 함수 O, 결제 가능) + GitHub Pages(정적, 결제 불가) 이원화. Firebase 인증 환경변수(`VITE_FIREBASE_*`)를 Vercel CLI로 Preview/Production 양쪽에 등록해 프리뷰 배포에서도 로그인/게시판 정상 동작 |
| 데이터 | 상품: 로컬 JSON / 게시판(공지·리뷰·QnA·이벤트): Firestore 실시간 연동 |
| Lint | oxlint |

---

## 4. 디자인 시스템
- `index.css`에 CSS 커스텀 프로퍼티로 디자인 토큰화: 브랜드 컬러(네이비 `#040922` / 블루 `#094089` / 그라디언트), 폰트 크기 6단계, font-weight 4단계, line-height, radius, shadow
- 반응형 루트 폰트: 900 / 768 / 480px 브레이크포인트에서 `html { font-size }` 자체를 축소 → rem 기반 전체 UI가 함께 스케일
- 브랜드 그라디언트(`--gradient-brand`)를 결제 버튼 등 핵심 CTA에 일관 적용
- 모바일 퍼스트 앱형 레이아웃(`page-root` / `page-scroll` 패턴)

---

## 5. 정보구조(IA) / 라우팅
- react-router-dom 기반 SPA, 20개 이상 라우트
- **홈 / 상품**(목록·상세·맥라렌 에디션·프로모션) **/ 커머스 플로우**(장바구니 → 체크아웃 → 주문완료 → 결제성공) **/ 마이페이지**(주문내역·쿠폰) **/ 게시판**(공지·QnA·리뷰·이벤트, `BoardTabs` 공용 컴포넌트 + Firestore 실시간 연동, 글쓰기 페이지 3종) **/ 계정**(로그인·회원가입 — Firebase Authentication 이메일/구글) **/ 회사소개 / FAQ / 404**
- Provider 계층: `BrowserRouter > CartProvider > WishlistProvider > SearchProvider > MenuProvider > Layout > Routes` — 전역 상태를 라우팅 바깥에 감싸 페이지 전환 시에도 카트 / 위시리스트 유지
- `ScrollToTop`으로 라우트 변경 시 스크롤 위치 초기화

---

## 6. 데이터 구조 — products.json 필드

| 필드 | 설명 |
|---|---|
| id, name, price, salePrice, discountRate | 기본 상품 정보 및 할인가 |
| image, category, colors[]({name, hex}), connectivity | 표시용 이미지 경로, 분류, 색상 배열(이름+hex), 연결방식 |
| description, stock | 상세 설명, 재고 |
| rating, reviewCount, reviewKeywords[] | 평점, 리뷰 수, 리뷰 키워드 태그 |
| isBest / isSale / isNew | 뱃지 표시 + 필터링용 boolean 플래그 |
| reviews[] | 중첩 배열 (id, user, rating, date, content) — 상세페이지 리뷰 렌더링 |

- `specialProducts.json`은 동일 스키마를 재사용, `category: "맥라렌 에디션"` 등 프로모션 전용 상품(id 101~)만 별도 관리
- (마이그레이션) `color` 문자열 필드를 부분일치 문자열로 hex를 추론하던 방식에서, `colors: [{ name, hex }]` 형태로 hex 값을 데이터에 직접 명시하는 구조로 변경 — 색상별 스와치가 상세페이지·장바구니 담기 팝업 등 여러 화면에서 항상 동일하게 표시되도록 단일 소스화

---

## 6-1. Firestore 컬렉션 구조 (게시판)

| 컬렉션 | 주요 필드 | 비고 |
|---|---|---|
| `notices` | title, content, category, authorId, authorEmail, createdAt | 카테고리/기간/검색어(제목·내용) 필터 |
| `reviews` | productId, productName, productImage, rating, content, imageUrl?, authorId, authorEmail, createdAt | `imageUrl` 유무로 포토/일반 리뷰 자동 분류 |
| `qna` | title, content, category, secret, authorId, authorEmail, createdAt | `secret=true`면 작성자 본인 외 내용 비공개(클라이언트 마스킹) |
| `events` | title, content, category?, imageUrl?, startDate?, endDate?, createdAt | 글쓰기 UI 없음 — 관리자가 Firestore 콘솔에서 직접 등록 |

- 공용 유틸 `src/firebase/board.js`: `subscribeBoardPosts`(onSnapshot 실시간 구독) / `addBoardPost`(등록) / `filterPosts`(카테고리·기간·검색어 클라이언트 필터링)를 4개 게시판이 공유
- 보안 규칙(`firestore.rules`): 읽기는 전체 공개, 쓰기는 로그인 사용자 본인 명의 문서만 생성/수정/삭제 가능. 이벤트는 클라이언트 쓰기 자체를 차단(`allow write: if false`)

---

## 7. 핵심기능
- **상품 탐색**: 카테고리바 + 필터칩(BEST/NEW/SALE) + 정렬(추천/가격/리뷰순) 조합, `useMemo`로 필터링 연산 최적화, URL 쿼리파라미터와 동기화되어 딥링크 지원
- **이미지 자동 매핑**: `import.meta.glob`으로 폴더 내 모든 상품 이미지를 빌드타임에 자동 인덱싱(`imageMap.js`) → JSON에는 파일명만 적으면 자동 연결, 색상 배리에이션(`_color_N`) 대응 로직 별도 구현
- **장바구니/위시리스트**: Context + localStorage로 새로고침해도 유지
- **검색**: 오버레이 형태, 상품명·카테고리 실시간 부분일치
- **실 결제 연동(Polar.sh)**: 장바구니 상품명 → Polar API로 실시간 상품 매칭 → 체크아웃 세션 생성 → Polar 결제 페이지 리다이렉트 → 성공 시 `/success` 복귀
- **보안**: 결제 액세스 토큰을 브라우저에 절대 노출하지 않고 서버(Vite proxy / Vercel 서버리스)에서만 주입
- **비주얼 인터랙션**: Three.js 커스텀 GLSL 셰이더 배경(`DigitalPetalsShader`, `MagicRings`), GSAP 기반 커스텀 타겟 커서, 호버 확장 이미지 아코디언, 배경 클릭 시 사이드바 열림/닫힘 토글
- **화이트/블랙 버전 전환**: 버튼 클릭으로 콘텐츠 페이지 전체를 라이트↔다크로 전환. `filter: invert(1) hue-rotate(180deg)`를 콘텐츠 영역에만 적용하고, 사진·동영상·특정 배너에는 동일 필터를 한 번 더 걸어 상쇄시켜 색이 반전되지 않고 원본 그대로 보이도록 구현. 사이드바·배경 장식·하단 탭바 등 UI 크롬은 반전 범위에서 제외해 페이지 콘텐츠만 테마가 바뀜
- **게시판 4종 Firebase 연동**: 공지사항·리뷰·상품문의·이벤트를 Cloud Firestore `onSnapshot` 실시간 구독으로 전환. 공지사항은 카테고리·기간·검색어(제목/내용) 필터가 실제로 동작하도록 구현, 리뷰는 상품 선택형 글쓰기(별점 + 사진 URL)로 포토/일반 리뷰가 자동 분류되고, 상품문의는 비밀글 체크 시 작성자 본인 외에는 내용이 마스킹됨. 이벤트는 목록+검색만 제공(글쓰기 없음). 글쓰기는 Firebase Authentication(이메일/구글) 로그인이 필요하며, 로그인 상태는 사이드바 슬라이드 메뉴에도 즉시 반영(이메일 표시 + 로그아웃)
- **전역 플로팅 숏컷 버튼**: 카테고리 5종(헤드폰/이어버드/무선스피커/라우드스피커/액세서리) + 장바구니 + 맨 위로 이동 버튼을 `FloatingActions` 컴포넌트로 분리해 `Layout`에서 로그인 페이지를 제외한 전 페이지에 공통 렌더링. `createPortal`로 `document.body`에 렌더링해 다크모드 반전 필터의 영향권 밖에 위치시킴

---

## 8. 작업물 소개 (구현 화면 기준으로 스크린샷 배치 추천)
- 홈: 히어로 GIF, 프로모션 배너, 신제품/베스트 섹션
- 상품 목록/상세: 필터·정렬, 색상 옵션, 상세 컷, 리뷰
- 맥라렌 에디션 / 프로모션 특별 페이지
- 장바구니 → 체크아웃 → Polar 결제 → 주문완료
- 마이페이지(주문내역·쿠폰), 게시판(공지·QnA·리뷰·이벤트) + 글쓰기 화면 3종, 로그인/회원가입 팝업, 로그인 상태가 반영된 사이드바 슬라이드 메뉴

---

## 9. 트러블슈팅 (실제 git 커밋 기반)
1. **미설치 패키지(`@base-ui/react`) 참조로 프로덕션 빌드 실패** — dev 캐시엔 남아있었지만 실제 미설치라 prod build에서 module resolve 실패 → `Toolbar.Root/Button`을 순수 div/button + `role="toolbar"`로 교체
2. **Windows에서 Vercel 캐치올 라우트(`[...path].js`) 빌드 실패** — `@vercel/nft`가 대괄호 파일명을 Windows에서 readlink 시 EISDIR 오류 → 파일명 고정 + 나머지 경로를 쿼리파라미터(`rest`)로 전달받는 방식으로 우회
3. **결제 토큰 노출 위험** — 클라이언트 직접 호출 시 액세스 토큰이 번들에 노출 → dev는 Vite proxy, prod는 Vercel 서버리스 함수로 이원화해 항상 서버사이드에서만 주입
4. **Vercel 업로드 100MB 제한 초과** — node_modules/dist까지 업로드 → `.vercelignore`로 제외, 대용량 히어로 GIF는 Vercel Blob 업로드 후 환경변수로 대체
5. **SPA 캐치올 리라이트가 favicon.ico 등 정적 파일까지 index.html 반환** — 정규식이 확장자 유무를 구분 못함 → negative lookahead 추가로 확장자 있는 경로 제외
6. **배포 플랫폼 이원화(Vercel/GitHub Pages)** — 정적 호스팅은 서버리스 함수를 못 써 결제 불가 → 이 제약을 문서화하고 base path/basename을 배포 대상별로 분기
7. **상품 색상이 화면마다 다르게 보이는 버그** — 상세페이지는 색상명 부분일치로 hex를 추측하는 별도 로직을, 장바구니 담기 팝업은 카테고리별 하드코딩 색상 목록을 각각 따로 쓰고 있어 같은 상품인데 두 화면의 색상 옵션이 서로 달랐음 → JSON에 `colors:[{name,hex}]`로 hex 값을 직접 저장해 단일 소스화, 두 화면 모두 동일 데이터를 그대로 렌더링하도록 통일
8. **다크모드에서 사진/영상까지 반전되는 문제** — 전체 페이지에 `filter: invert()`를 걸면 배경/텍스트는 물론 실제 사진 색까지 반전됨 → 같은 필터를 `img`/`video`에 한 번 더 걸어 이중 반전으로 상쇄시켜 사진만 원본 색 유지. 단, invert 강도가 정확히 100%가 아니면(예: 92%) 두 번 적용해도 완전히 상쇄되지 않아 사진이 뿌옇게 뜨는 부작용 발견 → 100%로 고정해 해결
9. **CSS `filter`가 `position: fixed` 요소의 위치 기준을 바꿔버리는 버그** — 콘텐츠 영역에 다크모드 필터를 걸었더니, 그 안에 있던 플로팅 버튼(장바구니/GoTop)이 화면 우측 하단이 아니라 페이지 전체 하단으로 밀려나 사라짐(스펙상 `filter`가 걸린 요소는 fixed 자손의 containing block이 됨) → 문서 루트(`html`)는 이 규칙에서 예외라는 점을 이용해 다크모드 반전은 `html`이 아닌 콘텐츠 영역에만 걸고, 해당 버튼은 `createPortal`로 `document.body`에 렌더링해 필터 영향권 밖으로 분리
10. **하단 탭바의 노치(홈 버튼 자리) 모양이 반응형에서 깨지는 문제** — 노치 곡선이 그려진 PNG를 배경 이미지로 `background-size: 100% 100%`로 늘려 쓰다 보니 화면 폭이 바뀔 때마다 곡선이 비율에 안 맞게 찌그러짐 → 같은 PNG를 `mask-image`(실루엣만 추출)로 전환해, 배경은 CSS로 자유롭게 바꾸면서 노치 모양은 항상 원본 비율 그대로 유지
11. **Firebase 설정 전, 무관한 페이지 클릭만으로 앱 전체가 흰 화면 크래시** — `.env`에 Firebase config를 넣기 전 상태에서 `getAuth(app)`을 모듈 최상단에서 바로 호출하면 `auth/invalid-api-key`가 동기적으로 throw됨. `AuthProvider`가 라우터 전체를 감싸는 구조라 게시판처럼 Firebase와 무관해 보이는 페이지를 눌러도 React 루트 자체가 죽어 흰 화면이 되고, JS가 멈추니 뒤로가기도 응답하지 않음 → `firebaseReady` 플래그로 config 존재 여부를 먼저 검사해, 없으면 `auth`/`db`를 `null`로 유지하고 로그인·글쓰기·Firestore 구독을 각각 안전한 no-op(빈 배열 반환·안내 에러 메시지)으로 처리하도록 방어 코드 추가
12. **Google 로그인/회원가입이 원인 모르게 조용히 실패** — Firebase Auth 에러를 화면에 "다시 시도해주세요" 같은 일반 문구로만 보여주다 보니 실제 원인을 알 수 없었음 → 에러 메시지에 `err.code`를 그대로 노출하도록 고쳐서 즉시 원인 특정. 실제 원인은 `auth/unauthorized-domain`이었고, Firebase 콘솔의 "승인된 도메인"은 `https://`·포트·경로 없이 호스트명만 등록해야 하며 `localhost`는 포트 무관하게 이미 기본 승인되어 있다는 점도 함께 확인
13. **우측 플로팅 "맨 위로" 버튼이 클릭해도 반응 없음** — `document.querySelector('.page-scroll')`을 스크롤 대상으로 삼았지만, 이 프로젝트의 `.page-scroll`은 자체 `overflow` 없이 브라우저 기본 스크롤을 그대로 쓰는 요소라 그 위에 `scrollTo()`를 호출해도 아무 효과가 없었음 → 실제 스크롤이 일어나는 `window`에 `window.scrollTo()`를 호출하도록 수정. 같은 프로젝트의 `ScrollToTop.jsx`에는 이미 올바른 패턴이 있었는데도 새 컴포넌트를 만들며 같은 실수를 반복 — 기존 코드에 정답이 있는지 먼저 확인하는 습관의 중요성을 체감
14. **새로 추가한 상세컷 이미지가 상세페이지 갤러리에 안 나타남** — `resolveDetailImages`에는 "메인 사진과 파일명이 같으면 중복이니 제외"하는 규칙이 있는데, 스피커 스탠드 4개 제품의 `detail` 폴더 안에 마침 메인 사진과 동일한 파일명의 이미지가 이미 들어있어 항상 제외되고 있었음(내용은 실제로 다른 사진인데 이름만 같아서 필터링됨) → 파일명을 `detail_1`/`detail_2`로 바꿔 규칙을 우회, 폴더당 이미지 2장이 모두 노출되도록 수정
15. **이미지 파일만 교체/추가했는데 개발 서버가 계속 옛날 이미지를 보여줌** — `vite.config.js`가 `server.watch.ignored`에 `src/assets/images/**`를 넣어 이미지 폴더 변경 감지를 의도적으로 꺼두고 있음(대용량 이미지 때문에 매번 리로드되는 것을 방지). `import.meta.glob`은 새 파일을 인식하지만 감시가 꺼져 있어 실행 중인 dev 서버엔 반영되지 않음 → 이미지 자산만 교체/추가한 경우엔 dev 서버 재시작이 필요하다는 점을 프로젝트 관례로 확정

---

## 10. 배운점 및 확장 아이디어

**배운점**
- 결제 연동을 시도하면서 "토큰은 클라이언트에 노출하면 안 된다"는 원칙을 서버리스 프록시로 직접 체감
- 배포 플랫폼마다 제약이 다름을 실제로 겪으며 정적 호스팅 vs 서버리스 아키텍처 차이를 체득
- Windows 로컬 환경과 Linux 기반 빌드 환경의 차이로 인한 빌드 실패를 다수 경험 → 크로스플랫폼 디버깅 능력
- JSON 정적 데이터만으로도 실 커머스에 준하는 필터 / 정렬 / 장바구니 / 리뷰 인터랙션 설계가 가능함을 확인
- 데이터를 화면마다 각자 다른 방식으로 파생시키면(부분일치 추측, 하드코딩 등) 반드시 화면 간 불일치가 생긴다는 것을 색상 버그로 체감 → "추측하지 말고 데이터에 명시"하는 원칙 체득
- CSS `filter`/`backdrop-filter`가 겉보기와 달리 `position: fixed` 자손의 위치 기준(containing block)까지 바꿔버린다는 스펙의 잘 알려지지 않은 부작용을 실제로 겪고, 문서 루트(`html`)만 예외라는 점까지 파악해 대응
- 서드파티 SDK(Firebase)를 조건 없이 최상단에서 바로 초기화하면, 설정값 하나가 비어있는 것만으로 그 SDK와 무관한 기능까지 전부 죽을 수 있다는 것을 실제로 겪음 → 항상 "준비 상태" 플래그로 감싸 부분 실패가 전체 장애로 번지지 않게 방어하는 습관 체득
- 에러 메시지를 사용자 친화적인 문구로만 뭉뚱그리면, 정작 개발 중엔 원인을 못 찾아 삽질이 길어짐 → 원인 코드(`err.code`)를 함께 노출해두면 디버깅 속도가 확연히 빨라진다는 것을 Google 로그인 트러블슈팅에서 체감
- 새 컴포넌트를 작성하기 전에 같은 프로젝트 안에 이미 같은 문제를 올바르게 처리한 코드(`ScrollToTop.jsx`)가 있는지부터 확인했어야 했다는 것을, 똑같은 실수를 반복하고 나서야 깨달음

**확장 아이디어**
- 상품 데이터도 Firestore로 이전 → 관리자 상품 CRUD (현재 게시판만 Firestore, 상품은 여전히 로컬 JSON)
- 이벤트 게시판 관리자 작성 UI 추가 (현재는 Firestore 콘솔에서 수동 등록)
- QnA 비밀글의 진짜 필드 단위 비공개 처리 — Firestore 규칙은 문서 단위 제어만 가능해 지금은 클라이언트에서만 마스킹 → Cloud Functions 프록시로 서버사이드 은닉 필요
- Vercel 프로덕션 승격 — 현재는 Preview 배포까지만 진행, 동작 검증 후 `vercel --prod`로 실제 서비스 도메인 반영 필요
- Polar 웹훅(`POLAR_WEBHOOK_SECRET`) 연결로 결제 완료 시 주문 DB 자동 반영
- 이미지 최적화(WebP, lazy loading, CDN)
- 상품 3D 뷰어 등 Three.js 활용 확장
- 접근성(a11y) 및 SEO 보완
