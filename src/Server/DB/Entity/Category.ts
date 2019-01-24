import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";
import { Game }                                      from "./Game";


@Entity("categories")
export class Category {
    @PrimaryColumn() id : number;

    @Column() name : string;

    @ManyToMany(type => Game, game => game.categories) games : Game[];
}