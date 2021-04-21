import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Game }                                               from "./Game";


@Entity("developers")
export class Developer {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({unique: true})
    name : string;

    @ManyToMany(type => Game, game => game.developers)
    games : Promise<Game[]>;
}