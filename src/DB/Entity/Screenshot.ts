import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Game }                                              from "./Game";

@Entity()
export class Screenshot {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    thumbnail: string;

    @Column()
    full: string;

    @ManyToOne(type => Game, game => game.screenshots)
    game: Game;
}