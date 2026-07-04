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
| 배포 | Vercel(서버리스 함수 O, 결제 가능) + GitHub Pages(정적, 결제 불가) 이원화 |
| 데이터 | 로컬 JSON (백엔드 없이 필터 / 정렬 / 리뷰까지 구현) |
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
- **홈 / 상품**(목록·상세·맥라렌 에디션·프로모션) **/ 커머스 플로우**(장바구니 → 체크아웃 → 주문완료 → 결제성공) **/ 마이페이지**(주문내역·쿠폰) **/ 게시판**(공지·QnA·리뷰·이벤트, `BoardTabs` 공용 컴포넌트) **/ 계정**(로그인·회원가입) **/ 회사소개 / FAQ / 404**
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

## 7. 핵심기능
- **상품 탐색**: 카테고리바 + 필터칩(BEST/NEW/SALE) + 정렬(추천/가격/리뷰순) 조합, `useMemo`로 필터링 연산 최적화, URL 쿼리파라미터와 동기화되어 딥링크 지원
- **이미지 자동 매핑**: `import.meta.glob`으로 폴더 내 모든 상품 이미지를 빌드타임에 자동 인덱싱(`imageMap.js`) → JSON에는 파일명만 적으면 자동 연결, 색상 배리에이션(`_color_N`) 대응 로직 별도 구현
- **장바구니/위시리스트**: Context + localStorage로 새로고침해도 유지
- **검색**: 오버레이 형태, 상품명·카테고리 실시간 부분일치
- **실 결제 연동(Polar.sh)**: 장바구니 상품명 → Polar API로 실시간 상품 매칭 → 체크아웃 세션 생성 → Polar 결제 페이지 리다이렉트 → 성공 시 `/success` 복귀
- **보안**: 결제 액세스 토큰을 브라우저에 절대 노출하지 않고 서버(Vite proxy / Vercel 서버리스)에서만 주입
- **비주얼 인터랙션**: Three.js 커스텀 GLSL 셰이더 배경(`DigitalPetalsShader`, `MagicRings`), GSAP 기반 커스텀 타겟 커서, 호버 확장 이미지 아코디언, 배경 클릭 시 사이드바 열림/닫힘 토글
- **화이트/블랙 버전 전환**: 버튼 클릭으로 콘텐츠 페이지 전체를 라이트↔다크로 전환. `filter: invert(1) hue-rotate(180deg)`를 콘텐츠 영역에만 적용하고, 사진·동영상·특정 배너에는 동일 필터를 한 번 더 걸어 상쇄시켜 색이 반전되지 않고 원본 그대로 보이도록 구현. 사이드바·배경 장식·하단 탭바 등 UI 크롬은 반전 범위에서 제외해 페이지 콘텐츠만 테마가 바뀜

---

## 8. 작업물 소개 (구현 화면 기준으로 스크린샷 배치 추천)
- 홈: 히어로 GIF, 프로모션 배너, 신제품/베스트 섹션
- 상품 목록/상세: 필터·정렬, 색상 옵션, 상세 컷, 리뷰
- 맥라렌 에디션 / 프로모션 특별 페이지
- 장바구니 → 체크아웃 → Polar 결제 → 주문완료
- 마이페이지(주문내역·쿠폰), 게시판(공지·QnA·리뷰·이벤트), 로그인/회원가입 팝업

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

---

## 10. 배운점 및 확장 아이디어

**배운점**
- 결제 연동을 시도하면서 "토큰은 클라이언트에 노출하면 안 된다"는 원칙을 서버리스 프록시로 직접 체감
- 배포 플랫폼마다 제약이 다름을 실제로 겪으며 정적 호스팅 vs 서버리스 아키텍처 차이를 체득
- Windows 로컬 환경과 Linux 기반 빌드 환경의 차이로 인한 빌드 실패를 다수 경험 → 크로스플랫폼 디버깅 능력
- JSON 정적 데이터만으로도 실 커머스에 준하는 필터 / 정렬 / 장바구니 / 리뷰 인터랙션 설계가 가능함을 확인
- 데이터를 화면마다 각자 다른 방식으로 파생시키면(부분일치 추측, 하드코딩 등) 반드시 화면 간 불일치가 생긴다는 것을 색상 버그로 체감 → "추측하지 말고 데이터에 명시"하는 원칙 체득
- CSS `filter`/`backdrop-filter`가 겉보기와 달리 `position: fixed` 자손의 위치 기준(containing block)까지 바꿔버린다는 스펙의 잘 알려지지 않은 부작용을 실제로 겪고, 문서 루트(`html`)만 예외라는 점까지 파악해 대응

**확장 아이디어**
- 실 백엔드/DB 연동 → 관리자 상품 CRUD
- 로그인을 실제 인증(OAuth/JWT)으로 고도화
- Polar 웹훅(`POLAR_WEBHOOK_SECRET`) 연결로 결제 완료 시 주문 DB 자동 반영
- 이미지 최적화(WebP, lazy loading, CDN)
- 상품 3D 뷰어 등 Three.js 활용 확장
- 접근성(a11y) 및 SEO 보완
