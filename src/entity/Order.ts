export default class Order {

    uuid: string; // Todo: 要檢查這利用 null 好不好
    user_id: number;
    create_time: Date;
    total_money: number;

    constructor(uuid: string, user_id: number, create_time: Date, total_money: number) {

        this.uuid = uuid;
        this.user_id = user_id;
        this.create_time = create_time;
        this.total_money = total_money;

    }
}
