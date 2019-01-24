import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";
import { Game }                                      from "./Game";


@Entity("developers")
export class Developer {
    @PrimaryColumn()
    id : number;

    @Column({unique: true})
    name : string;

    @ManyToMany(type => Game, game => game.developers)
    games : Promise<Game[]>;
}