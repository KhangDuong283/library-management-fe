<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
    style="z-index: 9999"
  >
    <div class="bg-white p-6 rounded-md shadow-lg w-96">
      <h2 class="text-xl font-bold mb-4">Cập nhật thông tin sách</h2>
      <form @submit.prevent="submitUpdate">
        <div class="mb-4">
          <label for="tensach" class="block">Tên sách</label>
          <input
            id="tensach"
            v-model="book.tensach"
            type="text"
            class="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div class="mb-4">
          <label for="nhaxuatban" class="block">Nhà xuất bản</label>
          <select
            v-model="book.nhaxuatban"
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

        <div class="flex mb-4 space-x-4">
          <div class="w-1/2">
            <label for="namxuatban" class="block">Năm xuất bản</label>
            <input
              id="namxuatban"
              v-model="book.namxuatban"
              type="number"
              class="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div class="w-1/2">
            <label for="soquyen" class="block">Số quyển</label>
            <input
              id="soquyen"
              v-model="book.soquyen"
              type="number"
              class="w-full p-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div class="mb-4">
          <label for="tacgia" class="block">Tác giả</label>
          <input
            id="tacgia"
            v-model="book.tacgia"
            type="text"
            class="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div class="flex justify-between">
          <v-btn color="red darken-2" @click="closeModal">Hủy</v-btn>
          <v-btn color="green darken-2" type="submit">Cập nhật</v-btn>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: Boolean,
    book: Object,
    nhaxuatbanList: Array,
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    submitUpdate() {
      this.$emit("update", this.book);
    },
  },
};
</script>
