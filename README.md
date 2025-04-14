# 백엔드 엔지니어 포지션 사전과제 - 최제원

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803.svg?style=for-the-badge&logo=typeorm&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## 1. docker 실행

```
docker compose -f docker/docker-compose.yml up
```

DB 정보는 아래와 같습니다

- DB USER NAME: root
- DB USER PASS: 1313
- DB NAME: ably-assignment

## 2. API 스펙 정리

API 스펙 swagger 도메인은 아래와 같습니다

- http://localhost:3000/swagger

### Auth

| Method | Endpoint          | Description       |
| ------ | ----------------- | ----------------- |
| POST   | `/v1/auth/signup` | 유저 회원가입 API |
| POST   | `/v1/auth/signin` | 유저 로그인 API   |

---

### User

| Method | Endpoint        | Description        |
| ------ | --------------- | ------------------ |
| GET    | `/v1/user/info` | 유저 본인 정보 API |

---

### Product

| Method | Endpoint                        | Description |
| ------ | ------------------------------- | ----------- |
| POST   | `/v1/products/{productId}/zzim` | 찜 생성 API |

---

### Zzim

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| GET    | `/v1/zzims`          | 내 찜 아이템 API(페이지네이션) |
| DELETE | `/v1/zzims/{zzimId}` | 내 찜 삭제 API                 |

---

### Drawer

| Method | Endpoint                      | Description                                              |
| ------ | ----------------------------- | -------------------------------------------------------- |
| POST   | `/v1/drawers`                 | 찜 박스 생성 API                                         |
| GET    | `/v1/drawers`                 | 찜 박스 리스트 조회 API(페이지네이션)                    |
| GET    | `/v1/drawers/{drawerId}/zzim` | 찜 박스 및 해당 찜 박스 찜 아이템 목록 API(페이지네이션) |
| DELETE | `/v1/drawers/{drawerId}`      | 찜 박스 삭제 API                                         |

## 추가 구현 사항

- 에이블리 찜 목록의 "전체 상품" API 추가 구현하였습니다 (GET /v1/zzims)

- 에이블리 찜 박스 목록 API 썸네일 제공 디테일을 구현하였습니다 (GET /v1/drawers)
  - 4개 이상의 찜이 존재하는 경우 최신순 이미지 4개 수령
  - 4개 미만의 찜이 존재하는 경우 최신순 이미지 1개 수령

## 특별히 신경 쓴 부분

### 1. "전체 상품" 탭을 위한 찜(zzim) 도메인의 비정규화 설계

- 해당 비정규화는 "상품(Product)" 데이터가 자주 수정되지 않는다는 전제를 기반으로 설계되었습니다.

- 전체 상품을 조회할 때, 찜(zzim)과 상품(product)을 매번 조인(Join)하여 가져오게 되면 데이터량이 많아질수록 API 응답 성능에 영향을 줄 수 있습니다.

- 이를 방지하기 위해, 찜을 생성하는 시점에 상품 정보를 스냅샷 형태로 zzim 테이블에 비정규화하여 저장합니다.

- 이 방식은 전체 상품 조회 시 조인 비용을 줄이고, 빠른 응답 성능을 확보하는 데 목적이 있습니다.

### 2. 찜박스(Drawer) 리스트 수령 시의 썸네일 및 zzim count 비정규화

- 찜박스(Drawer) 리스트를 조회할 때, 매번 Zzim 테이블과 조인을 통해 찜 개수를 계산하는 방식은 성능상 비효율적이라고 판단하여, zzim count를 Drawer 테이블에 비정규화하여 저장하였습니다.

- 실제 서비스인 에이블리의 사례를 참고하여, 찜 개수가 4개 이상인 경우와 미만인 경우에 따라 썸네일 렌더링 방식이 달라지는 점을 반영하였습니다.

- 이에 따라 Drawer `테이블에 썸네일 정보를 JSON 배열로 관리`하며, 항상 최신 찜 순서대로 정렬된 썸네일 이미지를 효율적으로 제공합니다.

- 찜의 생성 및 삭제 시, 해당 Drawer의 zzim count 및 썸네일 정보의 정합성을 유지하기 위해 `트랜잭션을 적용`하였습니다.

- 더불어, 동시성 문제를 방지하기 위해 TypeORM의 `비관적 락(Pessimistic Lock)을 사용`하여 일관성을 확보하였습니다.

동시성 이슈를 확인하기 위한 script를 아래와 같이 사용하였습니다

```
# 찜 생성 병렬 처리

for i in {1..5}
do
  curl -X POST http://localhost:3000/v1/product/5/zzim \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU0OSwidXNlckVtYWlsIjoidGVzdDRAZW1haWwuY29tIiwidXNlck5pY2tuYW1lIjoi7LWc7KCc7JuQMiIsImlhdCI6MTc0NDYyNTA2NiwiZXhwIjoxNzQ0NzExNDY2fQ.ippWMbo9RfMu3NG_dxra4v3bQcSjHLs3cZwle2s7mMA" \
    -H "Content-Type: application/json" \
    -d '{"drawer_id": 545}' &
done

wait
```

```
# 찜 삭제 병렬 처리

accessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU0OSwidXNlckVtYWlsIjoidGVzdDRAZW1haWwuY29tIiwidXNlck5pY2tuYW1lIjoi7LWc7KCc7JuQMiIsImlhdCI6MTc0NDYyNTA2NiwiZXhwIjoxNzQ0NzExNDY2fQ.ippWMbo9RfMu3NG_dxra4v3bQcSjHLs3cZwle2s7mMA"

for i in {1..5}
do
  curl -X DELETE "http://localhost:3000/v1/zzim/850" \
    -H "Authorization: Bearer $accessToken" \
    -H "Content-Type: application/json" &
done

wait
```

- 테스트 결과, 중복 생성/삭제 없이 정확한 결과가 반영되었으며, 데이터 정합성에도 문제가 발생하지 않았습니다.

- 이를 통해 실제 운영 환경에서도 안정적으로 동시성 처리가 가능하다는 점을 확인할 수 있었습니다.

### 3. 서비스 기동 안정성을 위한 wait-for-it.sh 활용

- docker-compose의 depends_on은 v3.9 기준으로 컨테이너 시작 순서만 보장하며, 내부 서비스(Mysql 등)의 준비 완료까지는 보장하지 않습니다.

- 이를 보완하기 위해 wait-for-it.sh를 활용하여 MySQL이 실제로 실행되고 포트가 열릴 때까지 대기하도록 설정했습니다.

- 이 덕분에 테스트 환경및 마이그레이션 환경과 서버 기동시, DB 미연결로 인한 실패를 방지하고 안정적인 기동을 보장할 수 있었습니다.

```
# nestjs.dockerfile 중 일부

COPY --from=builder /app/wait-for-it.sh ./wait-for-it.sh
RUN chmod +x ./wait-for-it.sh

COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000

CMD ["./wait-for-it.sh", "mysql:3306", "--", "node", "dist/main.js"]
```

### 4. 테스트 커버리지

프로젝트의 모든 주요 기능에 대해 End-to-End 테스트 중심으로 커버리지를 구성하여, 실제 사용자 흐름에 가까운 시나리오 기반의 테스트를 지향했습니다.

최대한 `100%에 가까운 커버리지를 확보`하였으며, 단위 테스트보다 사용자 플로우에 가까운 통합 테스트를 우선시하였습니다.

Docker Compose 실행 시, 테스트 커버리지는 터미널에서 바로 확인 가능하니 확인해주시면 감사하겠습니다.

![프로젝트 테스트 커버리지 예시](./assets/coverage.png)

### 5. 그 외에 신경 쓴 부분

- Swagger 커스텀 데코레이터 구성

  반복적으로 작성되는 Swagger 데코레이터를 커스텀 데코레이터로 분리하여, 컨트롤러의 가독성을 높이고 유지보수를 용이하게 하였습니다.

- Guard로 인증 로직 캡슐화

  사용자 인증 토큰 검증 로직을 Guard로 캡슐화하여, 인증이 필요한 API에서 일관되고 명확한 인증 흐름을 제공하였습니다.

- 커스텀 Provider 기반 Repository 주입

  - 복잡한 생성 로직 대응 가능
  - 의존성 주입의 명확한 분리.

- Exception Filter로 예외 포맷 통일

  비즈니스 로직에서 발생하는 예외의 응답 포맷을 통일하기 위해 Exception Filter를 적용하였고, 일관된 에러 메시지를 사용자에게 제공합니다.

- Response Interceptor로 응답 포맷 정형화

  API 응답 포맷을 일관되게 구성하여 프론트엔드와의 연동 편의성을 높였습니다. (ex. data, statusCode, message 형태로 구조화)

- Transaction 처리 캡슐화

  데코레이터와 인터셉터를 활용하여 트랜잭션 시작 및 커밋/롤백 로직을 캡슐화하였습니다. 이로 인해 각 서비스 내에서의 트랜잭션 코드 중복을 줄이고, 선언적 트랜잭션 관리가 가능해졌습니다.

## 마치며

테스트 기회를 주신 에이블리에 진심으로 감사드립니다

비전공자로 개발에 뛰어들며 스스로 부족함을 느낀 순간도 많았지만

에이블리라는 꿈에 그리던 기업의 서류를 통과하고 과제 전형까지 도전할 수 있었던 이번 경험은 제게 큰 용기와 확신을 주었습니다

이번 과제를 준비하며 진심으로 이 회사에 함께하고 싶다는 마음이 더욱 커졌습니다.

제 가능성과 진정성이 조금이나마 전달되었길 바라며,
에이블리와 함께 성장하는 개발자가 될 수 있기를 진심으로 바랍니다.

감사합니다.
