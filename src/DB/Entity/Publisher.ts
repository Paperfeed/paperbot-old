import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Game }                                               from "./Game";

@Entity()
export class Publisher {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(type => Game, game => game.publishers)
    games: Game[];
}