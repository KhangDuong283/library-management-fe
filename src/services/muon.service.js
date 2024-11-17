import createApiClient from "./api.service";
class MuonService {
    constructor(baseUrl = "/api/muon") {
        this.api = createApiClient(baseUrl);
    }
    async getAll() {
        return (await this.api.get("/")).data;
    }
    async create(data) {
        return (await this.api.post("/", data)).data;
    }
    async deleteAll() {
        return (await this.api.delete("/")).data;
    }
    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
    async returnBook(id) {
        return (await this.api.put(`/return/${id}`)).data;
    }
    async extendBorrow(id) {
        return (await this.api.put(`/extend/${id}`)).data;
    }
    async requestExtendBorrow(id) {
        return (await this.api.put(`/request-extend/${id}`)).data;
    }
    async rejectRequestExtendBorrow(id) {
        return (await this.api.put(`/reject-request-extend/${id}`)).data;
    }
    async acceptRequestExtendBorrow(id) {
        return (await this.api.put(`/accept-request-extend/${id}`)).data;
    }

}
export default new MuonService();
