/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Master from '../../../public/Season_2023_-_Master.png';

interface Player {
    id: number;
    name: string;
    pseudo: string;
    tag: string;
    summonerId: string;
    objectif: number;
}

export default function Card({ player }: { player: Player }) {
    const [soloRank, setSoloRank] = useState<{ tier: string; leaguePoints: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const options = {
                method: 'GET',
                url: 'https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + player.summonerId,
                params: { api_key: 'RGAPI-a0b01202-e163-4427-bd67-9ab563ca826a' },
                headers: {
                    'X-Riot-Token': 'RGAPI-a0b01202-e163-4427-bd67-9ab563ca826a',
                    'Content-Type': ''
                }
            };

            try {
                const response = await axios.request(options);

                // Filtrer les données pour trouver l'entrée RANKED_SOLO_5x5
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const rankedSolo = response.data.find((entry: any) => entry.queueType === "RANKED_SOLO_5x5");

                if (rankedSolo) {
                    setSoloRank({ tier: rankedSolo.tier, leaguePoints: rankedSolo.leaguePoints });
                } else {
                    setError('Pas de données pour le mode RANKED_SOLO_5x5');
                }
            } catch (err) {
                setError('Erreur lors du chargement des données');
                console.error(err);
            }
        };

        fetchData();
    }, [player.summonerId]);

    return (
        <div className="relative bg-Hextech-600 inline-block  rounded border border-gold-400 p-5 pr-8 pl-8 bg-opacity-40 ">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-Hextech-600 inline-block pl-3 pr-3 rounded border border-gold-400">
                <h1 className="font-beaufort-medium text-gold-400">
                    {player.name}
                </h1>
            </div>
            <div className='font-beaufort-medium text-gold-100'>
                <h2>{player.pseudo + "#" + player.tag}</h2>
            </div>


            <div>


                <img src={Master.src} alt="Master" className='h-12 mx-auto' />
                <p className='font-spiegel-regular text-gold-100 '>{100 + " / " + player.objectif} </p>
            </div>


            {/* Affichage des données récupérées pour RANKED_SOLO_5x5 */}
            {soloRank ? (
                <div>
                    <p>{soloRank.tier}</p>
                    <p>{soloRank.leaguePoints + " / " + player.objectif} </p>
                </div>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <p>Chargement...</p>
            )}
        </div>
    );
}
