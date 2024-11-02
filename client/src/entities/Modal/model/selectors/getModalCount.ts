import { StateSchema } from "@/app/providers"

export const getModalCount = (state: StateSchema) => state.modal.modalCount;

export const getModalMaxCount = (state: StateSchema) => state.modal.modalMaxCount;
