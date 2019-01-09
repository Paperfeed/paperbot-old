import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Game }                                               from "./Game";

@Entity()
export class Genre {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(type => Game, game => game.genres)
    games: Game[];
}