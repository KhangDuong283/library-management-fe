<template>
  <v-app>
    <v-app-bar color="primary" dark>
      <v-container fluid>
        <v-row align="center" justify="space-between">
          <v-col cols="auto">
            <v-btn text class="text-white" @click="goToBorrowing">
              <span class="font-bold text-2xl">Library Management</span>
            </v-btn>
          </v-col>

          <!-- Các liên kết điều hướng -->
          <v-col cols="auto" class="flex justify-center">
            <!-- Quản lý mượn sách -->
            <v-btn
              v-if="role === 'admin'"
              text
              :class="{ 'v-btn--active': $route.path === '/muon-management' }"
              class="text-white"
              @click="goToBorrowing"
            >
              Quản lý mượn sách
            </v-btn>

            <!-- Quản lý sách -->
            <v-btn
              v-if="role === 'admin'"
              text
              :class="{ 'v-btn--active': $route.path === '/sach-management' }"
              class="text-white"
              @click="goToBooks"
            >
              Quản lý sách
            </v-btn>

            <!-- Thư viện sách -->
            <v-btn
              v-if="role === 'user'"
              text
              :class="{ 'v-btn--active': $route.path === '/sach-management' }"
              class="text-white"
              @click="goToBooks"
            >
              Thư viện sách
            </v-btn>

            <!-- Lịch sử mượn sách -->
            <v-btn
              v-if="role === 'user'"
              text
              :class="{ 'v-btn--active': $route.path === '/muon-history' }"
              class="text-white"
              @click="goToLendHistory"
            >
              Lịch sử mượn sách
            </v-btn>
          </v-col>

          <!-- Hiển thị tên người dùng và nút logout -->
          <v-col
            cols="auto"
            class="flex justify-center items-center p-2 rounded-lg"
          >
            <span class="text-white font-medium text-base mr-2">
              {{ roleName + ": " }}
            </span>
            <span class="text-white font-medium text-base">
              {{ userName }}
            </span>
          </v-col>

          <v-btn
            icon
            class="hover:bg-white hover:bg-opacity-20"
            @click="logout"
          >
            <i class="fas fa-sign-out-alt"></i>
          </v-btn>
        </v-row>
      </v-container>
    </v-app-bar>
  </v-app>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      userName: this.getUserName(),
      roleName: this.getRole(),
      role: JSON.parse(localStorage.getItem("user")).role,
    };
  },
  methods: {
    // Lấy tên người dùng từ localStorage
    getUserName() {
      const user = localStorage.getItem("user");
      if (JSON.parse(user).hotennv != null) {
        return JSON.parse(user).hotennv || "Guest";
      } else {
        return user
          ? JSON.parse(user).hoLot + " " + JSON.parse(user).ten
          : "Guest";
      }
    },
    getRole() {
      const user = localStorage.getItem("user");
      if (JSON.parse(user).hotennv != null) return "Nhân viên";
      return "Độc giả";
    },
    // Điều hướng đến Quản lý mượn sách
    goToBorrowing() {
      this.$router.push("/muon-management");
    },
    // Điều hướng đến Quản lý sách
    goToBooks() {
      this.$router.push("/sach-management");
    },
    // Điều hướng đến Quản lý độc giả
    goToReaders() {
      this.$router.push("/docgia-management");
    },
    // Điều hướng đến Lịch sử mượn sách
    goToLendHistory() {
      this.$router.push("/muon-history");
    },
    // Xử lý đăng xuất
    logout() {
      localStorage.removeItem("user");
      this.$router.push({ name: "login-user" });
    },
  },
};
</script>

<style scoped>
.v-btn--active {
  border: 2px solid #f5f5f5;
}
</style>
