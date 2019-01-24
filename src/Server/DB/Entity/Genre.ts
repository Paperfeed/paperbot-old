import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";
import { Game }                                      from "./Game";


@Entity("genres")
export class Genre {
    @PrimaryColumn()
    id : number;

    @Column()
    name : string;

    @ManyToMany(type => Game, game => game.genres)
    games : Game[];
}