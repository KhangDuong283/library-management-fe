<template>
  <v-container class="pa-0">
    <v-row
      justify="center"
      align="center"
      class="h-full min-h-screen bg-gray-100"
    >
      <v-col cols="12" sm="8" md="4">
        <v-card class="rounded-lg shadow-lg p-3">
          <v-card-title class="text-h5 font-weight-bold text-center my-5">
            <span class="text-blue-600 text-3xl">Đăng Nhập Độc Giả</span>
          </v-card-title>

          <v-card-text>
            <form @submit.prevent="onSubmit">
              <!-- Số điện thoại -->
              <v-text-field
                v-model="dienThoai"
                label="Số điện thoại"
                type="tel"
                outlined
                class="mb-4"
                :rules="phoneRules"
                prefix="+84"
              ></v-text-field>

              <!-- Mật khẩu -->
              <v-text-field
                v-model="password"
                label="Mật khẩu"
                type="password"
                outlined
                class="mb-4"
                :rules="passwordRules"
              ></v-text-field>

              <!-- Nút Đăng nhập -->
              <v-btn
                type="submit"
                color="primary"
                class="w-full py-3 text-white font-bold rounded-lg"
              >
                Đăng Nhập
              </v-btn>

              <!-- Quên mật khẩu -->
              <div class="flex justify-end mt-4">
                <router-link to="/auth/forgot-password" class="text-blue-500">
                  Quên mật khẩu?
                </router-link>
              </div>
            </form>
          </v-card-text>

          <hr />
          <!-- Link Đăng ký -->
          <v-card-actions class="justify-center">
            <p class="text-center text-sm">
              Chưa có tài khoản?
              <router-link to="/auth/register" class="text-blue-500">
                Đăng ký ngay
              </router-link>
            </p>
          </v-card-actions>

          <!-- Link Đăng nhập với tài khoản quản trị -->
          <v-card-actions class="justify-center">
            <p class="text-center text-sm">
              <router-link to="/auth/login-admin" class="text-blue-500">
                Đăng nhập với tài khoản quản trị
              </router-link>
            </p>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DocgiaService from "@/services/docgia.service";
import { useToast } from "vue-toastification"; // Import Vue Toast

export default {
  data() {
    return {
      dienThoai: "",
      password: "",
      phoneRules: [(v) => !!v || "Số điện thoại là bắt buộc"],
      passwordRules: [(v) => !!v || "Mật khẩu là bắt buộc"],
    };
  },
  methods: {
    async onSubmit() {
      const toast = useToast(); // Initialize the toast

      try {
        const response = await DocgiaService.login(
          this.dienThoai,
          this.password
        );
        response.role = "user";

        if (response) {
          // Lưu thông tin người dùng vào localStorage
          // console.log(response);
          localStorage.setItem("user", JSON.stringify(response));

          this.$router.push({ name: "sach-management" });
          // Hiển thị thông báo thành công
          toast.success("Đăng nhập thành công!");
        } else {
          // Hiển thị thông báo lỗi
          toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
        }
      } catch (error) {
        // Hiển thị thông báo lỗi
        toast.error("Số điện thoại hoặc mật khẩu không chính xác");
      }
    },
  },
};
</script>

<style scoped>
.v-btn {
  background-color: #1877f2;
}

.v-btn:hover {
  background-color: #166fe5;
}
</style>
