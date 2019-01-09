import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Game }                                               from "./Game";

@Entity()
export class Developer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(type => Game, game => game.developers)
    games: Game[];
}