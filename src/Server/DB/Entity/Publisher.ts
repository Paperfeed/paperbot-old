import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Game }                                               from "./Game";


@Entity("publishers")
export class Publisher {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({unique: true})
    name : string;

    @ManyToMany(type => Game, game => game.publishers)
    games : Game[];
}