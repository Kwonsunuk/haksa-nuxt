<!-- layouts/default.vue -->
<template>
  <div class="container-fluid p-0">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top px-4">
      <div class="container">
        <NuxtLink class="navbar-brand" to="/">학사정보</NuxtLink>

        <!-- 모바일 메뉴 버튼 -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-center">
            <li class="nav-item">
              <NuxtLink class="nav-link" to="/notice">공지사항</NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link" to="/transcript">성적</NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link" to="/tuition">학비</NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link" to="/schedule">수강</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container" style="padding-top: 90px">
      <div class="row gx-0">
        <div class="col-md-3 mb-4">
          <ClientOnly>
            <!-- ClientOnly 컴포넌트로 감싸서 서버 사이드 렌더링을 방지. -->
            <Sidebar />
          </ClientOnly>
        </div>
        <div class="col-md-9">
          <NuxtPage />
        </div>
      </div>
    </div>
  </div>
  <ToastContainer />
</template>

<script setup>
import { onBeforeUnmount } from 'vue';
import { useUserStore } from '~/stores/userStore';
import { useAdminStore } from '~/stores/adminStore';
import { useToastStore } from '~/stores/toastStore';
import Sidebar from '~/components/Sidebar.vue';
import ToastContainer from '~/components/ToastContainer.vue';

const userStore = useUserStore();
const adminStore = useAdminStore();
const toastStore = useToastStore();

onBeforeUnmount(() => {
  toastStore.clearAll();
});
</script>
<style scoped>
.navbar-brand {
  font-weight: bold;
}
</style>

<!-- 
Hydration completed but contains mismatches. 오류 발생...


runtime-core.esm-bun…er.js?v=dab54000:50 [Vue warn]: Hydration node mismatch:
- rendered on server: 
  
- expected on client: div 
  at <Sidebar > 
  at <Default ref=Ref< undefined > > 
  at <AsyncComponentWrapper ref=Ref< undefined > > 
  at <LayoutLoader key="default" layoutProps= 
{ref: RefImpl}
 name="default" > 
  at <NuxtLayoutProvider layoutProps= 
{ref: RefImpl}
 key="default" name="default"  ... > 
  at <NuxtLayout > 
  at <App key=4 > 
  at <NuxtRoot>

  ----
  왜 Hydration Mismatch 경고가 떴었나?
  찾아보니 SSR vs CSR 렌더링 차이라고 한다.

  •	서버(SSR): 사용자 상태 정보(userStore.me 또는 adminStore.me)가 아직 로드되기 전이기 때문에, <Sidebar> 내부에서 사용자 이름을 보여주는 부분이 비어 있거나(Comment 노드) “로딩 중” 같은 플레이스홀더만 렌더링됬었고..
	•	클라이언트(CSR): 페이지 로드 후 fetchMe() 플러그인이 실행되며 me에 값이 채워지고, 그제야 <Sidebar>가 실제 사용자 이름을 가진 <div>를 출력하게 되었었다.

  이 둘이 일치하지 않으니 Vue가 “서버에서 주어진 DOM”과 “클라이언트에서 주어진 DOM” 간에 불일치가 있다고 경고를 뿜은 것이다.

  따라서 <ClientOnly> 컴포넌트를 사용하여 클라이언트에서만 렌더링되도록 하여 이 문제를 해결할 수 있다.
  •	<ClientOnly> 내부는 SSR 단계에서 “주석(Comment) 노드”만 남기고,
	•	CSR 단계에서 실제 컴포넌트를 마운트하기 때문에
	•	서버 렌더와 클라이언트 렌더가 같은 빈 주석으로 시작 → Hydration 불일치가 사라진다.
  추가적으로 레이아웃 전체에가 아닌 오류가 난 문제의 컴포넌트 부분만 감싸야한다.
 -->
