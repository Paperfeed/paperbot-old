import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("users")
export class User {

    @PrimaryColumn()
    id: number;

    @Column({nullable: true})
    steamId: string;

    @Column({nullable: true})
    games: string;

    @Column()
    createdOn: number;

}
