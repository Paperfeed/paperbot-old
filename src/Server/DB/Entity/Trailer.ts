import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Game }                                              from "./Game";


@Entity("trailers")
export class Trailer {
    @PrimaryGeneratedColumn() id : number;

    @Column() thumbnail : string;

    @Column() webm480 : string;

    @Column() webmFull : string;

    @ManyToOne(type => Game, game => game.trailers) game : Game;
}