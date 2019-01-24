import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { Genre }                                                           from "./Genre";
import { Category }                                                        from "./Category";
import { Screenshot }                                                      from "./Screenshot";
import { Publisher }                                                       from "./Publisher";
import { Developer }                                                       from "./Developer";
import { Trailer }                                                         from "./Trailer";


@Entity("games")
export class Game {
    @PrimaryColumn()
    id : number;

    @Column({nullable: true})
    type : string;

    @Column({nullable: true})
    name : string;

    @Column({nullable: true})
    requiredAge : number;

    @Column({nullable: true})
    iconUrl : string;

    @Column({nullable: true})
    logoUrl : string;

    @Column({nullable: true})
    detailedDescription : string;

    @Column({nullable: true})
    longDescription : string;

    @Column({nullable: true})
    shortDescription : string;

    @Column({nullable: true})
    languages : string;

    @Column({nullable: true})
    headerImage : string;

    @Column({nullable: true})
    website : string;

    @Column({nullable: true})
    score : number;

    @Column({nullable: true})
    recommendations : number;

    @Column({nullable: true})
    achievements : number;

    @Column({nullable: true})
    releaseDate : string;

    @Column({nullable: true})
    supportUrl : string;

    @Column({nullable: true})
    supportEmail : string;

    @Column({nullable: true})
    background : string;

    @Column({nullable: true})
    controllerSupport : string;

    @Column({nullable: true})
    drm : string;

    @ManyToMany(type => Genre, genre => genre.games, {eager: true})
    @JoinTable()
    genres : Genre[];

    @ManyToMany(type => Category, category => category.games, {eager: true})
    @JoinTable()
    categories : Category[];

    @ManyToMany(type => Publisher, publisher => publisher.games)
    @JoinTable()
    publishers : Promise<Publisher[]>;

    @ManyToMany(type => Developer, developer => developer.games)
    @JoinTable()
    developers : Promise<Developer[]>;

    @OneToMany(type => Screenshot, screenshot => screenshot.game)
    screenshots : Promise<Screenshot[]>;

    @OneToMany(type => Trailer, trailer => trailer.game)
    trailers : Promise<Trailer[]>;

    @Column({nullable: true})
    lastUpdate : number;

    @Column({nullable: true})
    hasContent : boolean;
}