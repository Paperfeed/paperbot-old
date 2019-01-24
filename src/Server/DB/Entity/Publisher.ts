import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";
import { Game }                                      from "./Game";


@Entity("publishers")
export class Publisher {
    @PrimaryColumn()
    id : number;

    @Column({unique: true})
    name : string;

    @ManyToMany(type => Game, game => game.publishers)
    games : Game[];
}