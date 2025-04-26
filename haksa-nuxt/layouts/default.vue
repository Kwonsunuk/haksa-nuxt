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
            <Sidebar />
        </div>
        <div class="col-md-9">
          <NuxtPage />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '~/components/Sidebar.vue';

import { useUserStore } from '~/stores/userStore';

import { useAsyncData } from '#app';

const userStore = useUserStore();
</script>
<style scoped>
.navbar-brand {
  font-weight: bold;
}
</style>
