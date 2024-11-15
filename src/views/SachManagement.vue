<template>
  <div class="book-management-page p-4">
    <!-- Tiêu đề chính -->
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Quản lý sách</h1>
    </div>

    <!-- Nút thêm sách mới -->
    <div class="flex justify-between items-center mb-4">
      <v-btn color="primary" @click="addNewBook">Thêm sách mới</v-btn>
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

    <!-- Modal Update Book -->
    <UpdateBookModal
      :isVisible="isModalVisible"
      :book="selectedBook"
      :nhaxuatbanList="nhaxuatbanList"
      @close="closeModal"
      @update="submitUpdate"
    />

    <!-- Modal Add Book -->
    <AddBookModal
      :isVisible="isAddBookModalVisible"
      :nhaxuatbanList="nhaxuatbanList"
      @close="closeAddBookModal"
      @add="submitAddBook"
    />
  </div>
</template>

<script>
import SachService from "@/services/sach.service";
import { useToast } from "vue-toastification";
import NhaxuatbanService from "@/services/nhaxuatban.service";
import UpdateBookModal from "../components/UpdateBookModel.vue";
import AddBookModal from "../components/AddBookModel.vue";

export default {
  components: {
    UpdateBookModal,
    AddBookModal,
  },
  data() {
    return {
      books: [], // Danh sách sách
      nhaxuatbanList: [], // Danh sách nhà xuất bản
      searchQuery: "", // Biến lưu trữ nội dung tìm kiếm
      isModalVisible: false, // Điều khiển hiển thị modal cập nhật sách
      isAddBookModalVisible: false, // Điều khiển hiển thị modal thêm sách
      selectedBook: {}, // Thông tin sách được chọn để cập nhật
    };
  },

  mounted() {
    this.fetchBooks();
    this.fetchNhaxuatbanList();
  },

  methods: {
    async fetchBooks() {
      try {
        const data = await SachService.getAll();
        this.books = data;
      } catch (error) {
        console.error("Lỗi khi gọi API lấy sách:", error);
      }
    },

    async fetchNhaxuatbanList() {
      try {
        const data = await NhaxuatbanService.getAll();
        this.nhaxuatbanList = data;
      } catch (error) {
        console.error("Lỗi khi gọi API lấy nhà xuất bản:", error);
      }
    },

    updateBook(book) {
      this.selectedBook = { ...book };
      this.isModalVisible = true;
    },

    closeModal() {
      this.isModalVisible = false;
      this.selectedBook = {}; // Reset dữ liệu
    },

    async submitUpdate(updatedBook) {
      try {
        let parseBook = JSON.parse(JSON.stringify(updatedBook));
        parseBook.manxb = parseBook.nhaxuatban._id;
        await SachService.update(updatedBook._id, parseBook);
        this.fetchBooks();
        this.closeModal();
      } catch (error) {
        console.error("Lỗi khi cập nhật sách:", error);
      }
    },

    addNewBook() {
      this.isAddBookModalVisible = true;
    },

    closeAddBookModal() {
      this.isAddBookModalVisible = false;
    },

    async submitAddBook(newBook) {
      try {
        let parseBook = JSON.parse(JSON.stringify(newBook));
        parseBook.manxb = parseBook.nhaxuatban._id;
        parseBook.nhaxuatban = null;
        console.log(parseBook);
        await SachService.create(parseBook);
        this.fetchBooks(); // Cập nhật lại danh sách sách
        this.closeAddBookModal();
      } catch (error) {
        console.error("Lỗi khi thêm sách:", error);
      }
    },

    async deleteBook(target) {
      const toast = useToast();
      try {
        await SachService.delete(target._id);
        toast.success("Xóa '" + target.tensach + "' thành công ");
        this.fetchBooks();
      } catch (error) {
        console.error("Lỗi khi xóa sách:", error);
      }
    },
  },
};
</script>
