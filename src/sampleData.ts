export interface sampleDataMassage {
    userId?: string;
    id: number;
    massage: string;
}
export interface sampleDataUser {
    userId: string,
    log: sampleDataMassage[]
}
export interface sampleData {
    name: string,
    chat: sampleDataUser[]
};

export interface UserData {
    userId: number;
    name: string;
    imageUrl?: string;
}

export interface MassageData {
    id: number;
    user: UserData;
    massage: string;
    date?: number;
}
export interface lastLogsData {
    user: UserData;
    lastLog: MassageData;
    notCheck: number;
}
export interface ChatData {
    userId?: number;
    user: UserData;
    chat: lastLogsData[];
}