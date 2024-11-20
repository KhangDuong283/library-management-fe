<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
    style="z-index: 9999"
  >
    <div class="bg-white p-6 rounded-md shadow-lg w-96">
      <h2 class="text-xl font-bold mb-4">Thêm sách mới</h2>
      <form @submit.prevent="submitAdd">
        <!-- Tên sách -->
        <div class="mb-4">
          <label for="tensach" class="block">Tên sách</label>
          <input
            id="tensach"
            v-model="newBook.tensach"
            type="text"
            class="w-full p-2 border rounded-md"
            required
          />
        </div>

        <!-- Nhà xuất bản -->
        <div class="mb-4">
          <label for="nhaxuatban" class="block">Nhà xuất bản</label>
          <select
            v-model="newBook.nhaxuatban"
            class="w-full p-2 border rounded-md"
            required
          >
            <option
              v-for="nhaxuatban in nhaxuatbanList"
              :key="nhaxuatban.id"
              :value="nhaxuatban"
            >
              {{ nhaxuatban.tennxb }}
            </option>
          </select>
        </div>

        <!-- Năm xuất bản và Số quyển -->
        <div class="flex mb-4 space-x-4">
          <div class="w-1/2">
            <label for="namxuatban" class="block">Năm xuất bản</label>
            <input
              id="namxuatban"
              v-model="newBook.namxuatban"
              type="number"
              class="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div class="w-1/2">
            <label for="soquyen" class="block">Số quyển</label>
            <input
              id="soquyen"
              v-model="newBook.soquyen"
              type="number"
              class="w-full p-2 border rounded-md"
              required
            />
          </div>
        </div>

        <!-- Tác giả -->
        <div class="mb-4">
          <label for="tacgia" class="block">Tác giả</label>
          <input
            id="tacgia"
            v-model="newBook.tacgia"
            type="text"
            class="w-full p-2 border rounded-md"
            required
          />
        </div>

        <!-- Thêm ảnh -->
        <div class="mb-4">
          <label for="image" class="block">Chọn ảnh</label>
          <input
            id="image"
            type="file"
            @change="handleImageChange"
            class="w-full p-2 border rounded-md"
            accept="image/*"
          />
          <div v-if="imagePreview" class="mt-2">
            <p>Preview ảnh:</p>
            <img
              :src="imagePreview"
              alt="Image Preview"
              class="w-24 h-24 object-cover mt-2"
            />
          </div>
        </div>

        <div class="flex justify-between">
          <v-btn color="red darken-2" @click="closeModal">Hủy</v-btn>
          <v-btn
            color="green darken-2"
            type="submit"
            :disabled="isCreating"
            class="flex items-center justify-center"
          >
            <template v-if="isCreating">
              <span
                class="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></span>
            </template>
            <template v-else> Thêm sách </template>
          </v-btn>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import SachService from "@/services/sach.service"; // Đảm bảo đường dẫn chính xác
import uploadService from "@/services/upload.service";

export default {
  props: {
    isVisible: Boolean,
    nhaxuatbanList: Array,
  },
  data() {
    return {
      newBook: {
        tensach: "",
        nhaxuatban: null,
        namxuatban: "",
        soquyen: "",
        tacgia: "",
        image: null, // Dữ liệu ảnh sẽ được lưu ở đây
      },
      imagePreview: null, // Preview ảnh sẽ được lưu ở đây
      isCreating: false,
    };
  },
  methods: {
    closeModal() {
      this.$emit("close"); // Đóng modal khi nhấn hủy
    },

    async submitAdd() {
      this.isCreating = true;
      try {
        if (this.newBook.image) {
          const imageData = await uploadService.uploadImage(this.newBook.image);
          this.newBook.imageUrl = imageData.imageUrl;
        }

        console.log("newBook", this.newBook);

        // Gửi đối tượng sách, bao gồm cả URL ảnh
        // await SachService.create(this.newBook);

        // Thông báo thêm sách thành công và reset form
        this.$emit("add", this.newBook);
        this.isCreating = false;
        this.resetForm();
      } catch (error) {
        console.error("Lỗi khi thêm sách:", error);
        alert("Có lỗi xảy ra khi thêm sách. Vui lòng thử lại.");
      }
    },

    handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        // Tạo đường dẫn URL tạm thời để preview ảnh
        this.imagePreview = URL.createObjectURL(file);
        this.newBook.image = file; // Lưu ảnh vào đối tượng sách
      }
    },

    resetForm() {
      this.newBook = {
        tensach: "",
        nhaxuatban: null,
        namxuatban: "",
        soquyen: "",
        tacgia: "",
        image: null,
      };
      this.imagePreview = null; // Reset preview ảnh
    },
  },
};
</script>
