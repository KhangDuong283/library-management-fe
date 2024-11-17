<template>
  <div class="book-management-page p-4">
    <!-- Tiêu đề chính -->
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800" v-if="role === `admin`">
        Quản lý sách
      </h1>

      <h1 class="text-3xl font-bold text-gray-800" v-if="role === `user`">
        Thư viện sách
      </h1>
    </div>
    <!-- Nút thêm sách mới -->
    <div class="flex justify-between items-center mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Tìm kiếm sách"
        class="p-2 border rounded-md text-sm w-64 bg-gray-100"
        style="z-index: 10"
      />

      <v-btn color="primary" @click="addNewBook" v-if="role === `admin`"
        >Thêm sách mới</v-btn
      >
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
            <th scope="col" class="px-6 py-3 text-center text-sm">Bìa sách</th>
            <th scope="col" class="px-6 py-3 text-center text-sm">Mã sách</th>
            <th scope="col" class="px-6 py-3 text-center text-sm">Tên sách</th>
            <th scope="col" class="px-6 py-3 text-center text-sm">Số quyển</th>
            <th scope="col" class="px-6 py-3 text-center text-sm">
              Năm xuất bản
            </th>
            <th scope="col" class="px-6 py-3 text-center text-sm">Tác giả</th>
            <th scope="col" class="px-6 py-3 text-center text-sm">
              Nhà xuất bản
            </th>
            <th
              v-if="role === 'admin'"
              scope="col"
              class="px-6 py-3 text-center text-sm"
            >
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in filteredBooks" :key="book.id">
            <td class="text-center">
              <a-image
                :src="book.imageUrl"
                alt="Bìa sách"
                style="height: 100px"
              />
            </td>
            <td
              @click="copyToClipboard(book._id, 'ID sách')"
              class="px-6 py-4 text-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:font-bold"
            >
              ...{{ book._id.slice(-6) }}
            </td>

            <td
              class="px-6 py-4 text-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:font-bold"
              @click="copyToClipboard(book.tensach, 'tên sách')"
            >
              {{ book.tensach.split(" ").slice(0, 8).join(" ")
              }}{{ book.tensach.split(" ").length > 8 ? "..." : "" }}
            </td>

            <td class="px-6 py-4 text-center">{{ book.soquyen }}</td>
            <td class="px-6 py-4 text-center">{{ book.namxuatban }}</td>
            <td class="px-6 py-4 text-center">{{ book.tacgia }}</td>
            <td class="px-6 py-4 text-center">{{ book.nhaxuatban.tennxb }}</td>
            <td class="px-6 py-4 text-center" v-if="role === 'admin'">
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
      role: JSON.parse(localStorage.getItem("user")).role,
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

    copyToClipboard(text, field) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          const toast = useToast();
          toast.success("Đã sao chép " + field + " vào clipboard", {
            timeout: 1500,
          });
        })
        .catch((err) => {
          console.error("Không thể sao chép " + field + ": ", err);
        });
    },
  },
  computed: {
    filteredBooks() {
      return this.books.filter((book) => {
        const searchTerm = this.searchQuery.toLowerCase();
        return (
          book.tensach.toLowerCase().includes(searchTerm) ||
          book.tacgia.toLowerCase().includes(searchTerm) ||
          book.nhaxuatban.tennxb.toLowerCase().includes(searchTerm) ||
          book.namxuatban.toString().includes(searchTerm) ||
          book._id.includes(searchTerm)
        );
      });
    },
  },
};
</script>

<style scoped>
td {
  position: relative;
  z-index: 10;
  cursor: pointer;
}
tr {
  transition: background-color 0.3s;
}

tr:hover {
  background-color: #e9e9e98c; /* Màu nền đậm hơn khi hover vào ô */
}
</style>
