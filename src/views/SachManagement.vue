<template>
  <div class="book-management-page p-4">
    <!-- Tiêu đề chính -->
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Quản lý sách</h1>
    </div>

    <!-- Nút thêm sách mới -->
    <div class="flex justify-between items-center mb-4">
      <!-- Nút Thêm sách mới -->
      <v-btn color="primary" @click="addNewBook">Thêm sách mới</v-btn>

      <!-- Input tìm kiếm -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Tìm kiếm sách"
        class="ml-4 p-2 border rounded-md text-sm w-64"
        style="z-index: 10"
      />
    </div>

    <!-- Table danh sách các quyển sách -->
    <div class="overflow-x-auto shadow-md sm:rounded-lg">
      <table
        class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400"
      >
        <!-- Header -->
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3 text-center text-sm">Tên sách</th>
            <th scope="col" class="px-6 py-3 text-center text-sm">Số quyển</th>
            <th scope="col" class="px-6 py-3 text-center text-sm">
              Năm xuất bản
            </th>
            <th scope="col" class="px-6 py-3 text-center text-sm">Tác giả</th>
            <th scope="col" class="px-6 py-3 text-center text-sm">
              Nhà xuất bản
            </th>
            <th scope="col" class="px-6 py-3 text-center text-sm">Hành động</th>
          </tr>
        </thead>
        <!-- Dữ liệu trong bảng -->
        <tbody>
          <tr v-for="book in books" :key="book.id">
            <td class="px-6 py-4 text-center">{{ book.tensach }}</td>
            <td class="px-6 py-4 text-center">{{ book.soquyen }}</td>
            <td class="px-6 py-4 text-center">{{ book.namxuatban }}</td>
            <td class="px-6 py-4 text-center">{{ book.tacgia }}</td>
            <td class="px-6 py-4 text-center">{{ book.nhaxuatban.tennxb }}</td>
            <td class="px-6 py-4 text-center">
              <div class="flex justify-center">
                <v-btn
                  small
                  color="blue darken-2"
                  class="mr-2"
                  @click="updateBook(book)"
                  >Cập nhật</v-btn
                >
                <v-btn small color="red darken-2" @click="deleteBook(book)"
                  >Xóa</v-btn
                >
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import SachService from "@/services/sach.service";
import { useToast } from "vue-toastification";

export default {
  data() {
    return {
      books: [],
      searchQuery: "", // Biến lưu trữ nội dung tìm kiếm
    };
  },
  mounted() {
    this.fetchBooks();
  },
  methods: {
    // Lấy danh sách sách từ API
    async fetchBooks() {
      try {
        const data = await SachService.getAll();
        this.books = data;
      } catch (error) {
        console.error("Lỗi khi gọi API lấy sách:", error);
      }
    },

    async addNewBook() {
      // Logic thêm sách mới
    },

    async updateBook(target) {
      try {
      } catch (error) {
        console.error("Lỗi khi cập nhật sách:", error);
      }
      console.log("Cập nhật sách:", target);
    },

    async deleteBook(target) {
      const toast = useToast();
      try {
        const confirmDelete = await SachService.delete(target._id);
        if (confirmDelete) {
          toast.success("Xóa sách thành công!");
          this.fetchBooks();
        }
      } catch (error) {
        toast.error("Lỗi khi xóa sách:");
      }
    },
  },
};
</script>

<style scoped>
.book-management-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
