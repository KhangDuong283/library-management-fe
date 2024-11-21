<template>
  <div class="borrow-management-page p-4">
    <!-- Tiêu đề chính -->
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800" v-if="role === `admin`">
        Quản lý mượn trả
      </h1>
      <h1 class="text-3xl font-bold text-gray-800" v-if="role === `user`">
        Lịch sử mượn sách
      </h1>
    </div>

    <div class="flex justify-between items-center mb-4" style="z-index: 10">
      <!-- Tìm kiếm -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Tìm kiếm mượn trả"
        class="p-2 border rounded-md text-sm w-64 bg-gray-100"
        style="z-index: 10"
      />

      <!-- Nút Thêm -->
      <div class="mb-4" style="z-index: 10" v-if="role === `admin`">
        <button
          @click="goToAddMuonSachPage"
          class="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Thêm mượn sách
        </button>
      </div>
    </div>

    <!-- Table danh sách mượn trả -->
    <div class="overflow-x-auto shadow-md sm:rounded-lg">
      <table
        class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400"
      >
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3 text-center">Tên độc giả</th>
            <th scope="col" class="px-6 py-3 text-center">Tên tên sách</th>
            <th scope="col" class="px-6 py-3 text-center">Ngày mượn</th>
            <th scope="col" class="px-6 py-3 text-center">Ngày trả</th>
            <th scope="col" class="px-6 py-3 text-center">Ngày hẹn trả</th>
            <th scope="col" class="px-6 py-3 text-center">Trạng thái</th>
            <th scope="col" class="px-6 py-3 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in filteredBorrowRecords" :key="record.id">
            <td class="px-6 py-4 text-center">
              {{
                (record.docGiaInfo.hoLot + " " + record.docGiaInfo.ten).length >
                20
                  ? (
                      record.docGiaInfo.hoLot +
                      " " +
                      record.docGiaInfo.ten
                    ).slice(0, 20) + "..."
                  : record.docGiaInfo.hoLot + " " + record.docGiaInfo.ten
              }}
            </td>

            <td class="px-6 py-4 text-center">
              {{ record.sachInfo.tensach.split(" ").slice(0, 8).join(" ") }}
              {{ record.sachInfo.tensach.split(" ").length > 8 ? "..." : "" }}
            </td>

            <td class="px-6 py-4 text-center">
              {{ formatTime(record.ngayMuon) }}
            </td>

            <td class="px-6 py-4 text-center">
              {{ formatTime(record.ngayTra) }}
            </td>

            <td class="px-6 py-4 text-center">
              <span v-if="getStatus(record) !== `Đã đăng ký mượn`">{{
                formatTime(record.ngayHenTra)
              }}</span>
            </td>

            <td class="px-6 py-4 text-center">
              <span
                :class="{
                  'text-orange-400 font-bold':
                    getStatus(record) === 'Đang mượn' && !isLate(record),
                  'text-green-600 font-bold': getStatus(record) === 'Đã trả',
                  'text-red-600 font-bold': getStatus(record) === 'Trả muộn',
                  'text-blue-600 font-bold':
                    getStatus(record) === 'Yêu cầu gia hạn',
                  'text-purple-600 font-bold':
                    getStatus(record) === 'Đã đăng ký mượn',
                }"
              >
                {{ getStatus(record) }}
                <template v-if="getLateDays(record) > 0">
                  ({{ getLateDays(record) }} ngày)
                </template>
              </span>
            </td>

            <td class="px-6 py-4 text-center" v-if="role === 'admin'">
              <!-- Nút Đồng ý -->
              <v-btn
                v-if="getStatus(record) === 'Đã đăng ký mượn'"
                small
                color="blue"
                @click="choMuon(record)"
                style="font-size: 0.7rem; font-weight: bold"
              >
                Xác nhận <br />
                đã đến nhận sách
              </v-btn>

              <!-- Hiển thị nút "Duyệt trả sách" nếu trạng thái là Đang mượn hoặc Trả muộn -->
              <v-btn
                small
                color="green darken-2"
                @click="approveReturn(record)"
                style="font-size: 0.7rem; font-weight: bold"
                v-if="
                  (getStatus(record) === 'Đang mượn' ||
                    getStatus(record) === 'Trả muộn') &&
                  getStatus(record) !== 'Yêu cầu gia hạn'
                "
              >
                Duyệt trả sách
              </v-btn>

              <!-- Hiển thị nút Đồng ý và Hủy nếu trạng thái là Yêu cầu gia hạn -->
              <div
                v-else-if="getStatus(record) === 'Yêu cầu gia hạn'"
                class="flex items-center justify-center space-x-2"
              >
                <!-- Nút Hủy -->
                <v-btn
                  small
                  color="red"
                  @click="rejectRequestExtendBorrow(record)"
                  style="font-size: 0.7rem; font-weight: bold"
                >
                  Hủy
                </v-btn>

                <!-- Nút Đồng ý -->
                <v-btn
                  small
                  color="yellow"
                  @click="acceptRequestExtendBorrow(record)"
                  style="font-size: 0.7rem; font-weight: bold"
                >
                  Đồng ý
                </v-btn>
              </div>

              <!-- Hiển thị trạng thái Đã xử lý nếu không khớp điều kiện -->
              <span v-if="getStatus(record) === `Đã trả`" class="text-gray-400"
                >Đã xử lý</span
              >
            </td>

            <td class="px-6 py-4 text-center" v-if="role === 'user'">
              <v-btn
                small
                color="secondary"
                @click="requestExtendBorrowing(record)"
                style="font-size: 0.7rem; font-weight: bold"
                v-if="
                  (getStatus(record) === 'Đang mượn' ||
                    getStatus(record) === 'Trả muộn') &&
                  getStatus(record) !== 'Yêu cầu gia hạn'
                "
              >
                Yêu cầu gia hạn
              </v-btn>

              <span
                v-else-if="getStatus(record) === 'Yêu cầu gia hạn'"
                class="text-gray-400"
              >
                Đã yêu cầu gia hạn
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import MuonService from "@/services/muon.service";

export default {
  data() {
    const today = new Date().toISOString().split("T")[0];
    return {
      borrowRecords: [],
      searchQuery: "",
      role: JSON.parse(localStorage.getItem("user")).role,
      userId: JSON.parse(localStorage.getItem("user"))._id,
    };
  },

  mounted() {
    this.fetchBorrowRecords();
  },

  methods: {
    async fetchBorrowRecords() {
      try {
        const data = await MuonService.getAll();

        if (this.role === "user") {
          this.borrowRecords = data.filter(
            (record) => record.docGiaInfo._id === this.userId
          );
        } else {
          this.borrowRecords = data;
        }
      } catch (error) {
        console.error("Lỗi khi gọi API lấy danh sách mượn trả:", error);
      }
    },

    // Xử lý khi form được submit
    async handleSubmit() {
      try {
        await MuonService.create(this.form);
        this.closeModal(); // Đóng modal sau khi thêm
        this.fetchBorrowRecords(); // Cập nhật lại danh sách mượn trả
      } catch (error) {
        console.error("Lỗi khi thêm mượn sách:", error);
      }
    },

    async approveReturn(record) {
      try {
        const recordCopy = JSON.parse(JSON.stringify(record));
        await MuonService.returnBook(recordCopy._id);
        this.fetchBorrowRecords();
      } catch (error) {
        console.error("Lỗi khi duyệt trả sách:", error);
      }
    },

    formatTime(isoDate) {
      if (!isoDate) return "";
      const date = new Date(isoDate);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },

    // Kiểm tra trạng thái: Nếu quá hạn, trả "Trả muộn", nếu không trả "Đã trả" hoặc "Đang mượn"
    getStatus(record) {
      if (this.isLate(record)) {
        return "Trả muộn";
      }
      if (record.status === "Yêu cầu gia hạn") {
        return "Yêu cầu gia hạn";
      }

      if (record.status === "Đã đăng ký mượn") {
        return "Đã đăng ký mượn";
      }
      return record.status === "Đã trả" ? "Đã trả" : "Đang mượn";
    },

    // Kiểm tra nếu quá hạn so với ngày hẹn trả
    isLate(record) {
      const currentDate = new Date();
      const returnDate = new Date(record.ngayHenTra);
      // Trả muộn nếu đã quá ngày hẹn trả
      return currentDate > returnDate && record.status === "Đang mượn";
    },

    goToAddMuonSachPage() {
      this.$router.push({ name: "them-muon-sach" });
    },

    getLateDays(record) {
      const today = new Date(); // Ngày hiện tại
      const dueDate = new Date(record.ngayHenTra); // Ngày hẹn trả

      // Nếu chưa trả và quá hạn, tính số ngày muộn
      if (today > dueDate && record.status === "Đang mượn") {
        const diffTime = today - dueDate; // Sự chênh lệch tính bằng milliseconds
        return Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Đổi sang ngày
      }

      return 0; // Không muộn nếu chưa tới ngày hoặc đã trả
    },

    async requestExtendBorrowing(record) {
      try {
        const recordCopy = JSON.parse(JSON.stringify(record));
        await MuonService.requestExtendBorrow(recordCopy._id);
        this.fetchBorrowRecords();
      } catch (error) {
        console.error("Lỗi khi yêu cầu gia hạn mượn sách:", error);
      }
    },

    async extendBorrowing(record) {
      try {
        const recordCopy = JSON.parse(JSON.stringify(record));
        await MuonService.extendBorrow(recordCopy._id);
        this.fetchBorrowRecords();
      } catch (error) {
        console.error("Lỗi khi duyệt trả sách:", error);
      }
    },

    async rejectRequestExtendBorrow(record) {
      try {
        const recordCopy = JSON.parse(JSON.stringify(record));
        await MuonService.rejectRequestExtendBorrow(recordCopy._id);
        this.fetchBorrowRecords();
      } catch (error) {
        console.error("Lỗi khi duyệt trả sách:", error);
      }
    },

    async acceptRequestExtendBorrow(record) {
      try {
        const recordCopy = JSON.parse(JSON.stringify(record));
        await MuonService.acceptRequestExtendBorrow(recordCopy._id);
        this.fetchBorrowRecords();
      } catch (error) {
        console.error("Lỗi khi duyệt trả sách:", error);
      }
    },

    async choMuon(record) {
      try {
        const recordCopy = JSON.parse(JSON.stringify(record));
        await MuonService.choMuon(recordCopy._id);
        this.fetchBorrowRecords();
      } catch (error) {
        console.error("Lỗi khi duyệt trả sách:", error);
      }
    },
  },

  computed: {
    filteredBorrowRecords() {
      return this.borrowRecords.filter((record) => {
        const searchTerm = this.searchQuery?.toLowerCase() || "";

        console.log(searchTerm);
        return (
          record.docGiaInfo.hoLot?.toLowerCase()?.includes(searchTerm) ||
          record.docGiaInfo.ten?.toLowerCase()?.includes(searchTerm) ||
          record.sachInfo.tensach?.toLowerCase()?.includes(searchTerm) ||
          record.ngayMuon?.toLowerCase()?.includes(searchTerm) ||
          record.ngayTra?.toLowerCase()?.includes(searchTerm) ||
          this.getStatus(record)?.toLowerCase().includes(searchTerm)
        );
      });
    },
  },
};
</script>

<style scoped>
tr {
  transition: background-color 0.3s;
}

tr:hover {
  background-color: #e9e9e98c; /* Màu nền đậm hơn khi hover vào ô */
}
</style>
