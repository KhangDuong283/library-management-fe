<template>
  <div class="add-borrow-page p-4">
    <h1 class="text-3xl font-bold text-center mb-6">Thêm mượn sách</h1>

    <div class="flex">
      <!-- Phần bên trái: Form thêm mượn sách -->
      <div class="w-1/2 p-4">
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="bookId" class="block text-sm font-medium text-gray-700"
              >Mã sách</label
            >
            <input
              id="bookId"
              v-model="form.bookId"
              type="text"
              placeholder="Nhập mã sách"
              class="mt-1 p-2 border rounded-md w-full"
              required
            />
          </div>

          <div class="mb-4">
            <label
              for="readerId"
              class="block text-sm font-medium text-gray-700"
              >Mã độc giả</label
            >
            <input
              id="readerId"
              v-model="form.readerId"
              type="text"
              placeholder="Nhập mã độc giả"
              class="mt-1 p-2 border rounded-md w-full"
              required
            />
          </div>

          <div class="mb-4">
            <label
              for="returnDate"
              class="block text-sm font-medium text-gray-700"
              >Ngày hẹn trả</label
            >
            <input
              id="returnDate"
              v-model="form.returnDate"
              type="date"
              class="mt-1 p-2 border rounded-md w-full"
              required
            />
          </div>

          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 rounded-md"
          >
            Thêm mượn sách
          </button>
        </form>
      </div>

      <!-- Phần bên phải: Tìm độc giả -->
      <div class="w-1/2 p-4">
        <div class="mb-4">
          <label
            for="phoneNumber"
            class="block text-sm font-medium text-gray-700"
            >Tìm độc giả</label
          >
          <div class="flex items-center">
            <input
              id="phoneNumber"
              v-model="searchPhone"
              type="text"
              placeholder="Nhập số điện thoại"
              class="p-2 border rounded-md w-3/4"
            />
            <button
              @click="searchReader"
              class="ml-2 bg-green-500 text-white p-2 rounded-md"
            >
              Tìm kiếm
            </button>
          </div>
        </div>

        <!-- Hiển thị tên độc giả và mã độc giả -->
        <div v-if="readerInfo" class="cursor-pointer mt-4">
          <p><strong>Tên độc giả:</strong> {{ readerInfo.name }}</p>
          <p>
            <strong>Mã độc giả:</strong> {{ readerInfo.id }}
            <v-btn
              variant="outlined"
              class="ml-2"
              @click="copyToClipboard(readerInfo.id, 'mã độc giả')"
            >
              <i class="fa-solid fa-copy"></i
            ></v-btn>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import docgiaService from "@/services/docgia.service";
import muonService from "@/services/muon.service";
import sachService from "@/services/sach.service";
import { useToast } from "vue-toastification";

export default {
  data() {
    const today = new Date();
    today.setDate(today.getDate() + 7);

    return {
      form: {
        bookId: "",
        readerId: "",
        returnDate: today.toISOString().split("T")[0],
      },
      searchPhone: "",
      readerInfo: null,
    };
  },

  methods: {
    async handleSubmit() {
      try {
        const data = {
          maDocGia: this.form.readerId,
          maSach: this.form.bookId,
          ngayHenTra: this.form.returnDate,
          // ngayMuon: new Date().toISOString().split("T")[0],
        };

        const book = await sachService.get(data.maSach);
        // console.log("Book:", book.soquyen);
        if (book?.soquyen === 0) {
          const toast = useToast();
          toast.error("Sách bạn tìm đã hết", { timeout: 1500 });
          return;
        }

        // console.log("Data to create:", data);

        await muonService.create(data);
        const toast = useToast();
        toast.success("Đã thêm mượn sách thành công", { timeout: 1500 });
        this.$router.push({ name: "muon-management" });
      } catch (error) {
        console.error("Lỗi khi thêm mượn sách:", error);
      }
    },

    async searchReader() {
      try {
        // Giả sử bạn sẽ gọi API tìm độc giả theo số điện thoại
        const data = await docgiaService.findByPhone(this.searchPhone);
        this.readerInfo = data
          ? { name: data.hoLot + " " + data.ten, id: data._id }
          : null;
      } catch (error) {
        console.error("Lỗi khi tìm độc giả:", error);
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
};
</script>

<style scoped>
.add-borrow-page {
  max-width: 1200px;
  margin: 0 auto;
}

.flex {
  display: flex;
  gap: 2rem;
  position: relative;
  z-index: 10;
}
</style>
