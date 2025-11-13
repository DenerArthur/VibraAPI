import yts from "yt-search";
import { Innertube } from "youtubei.js";

let youtube = null;

export async function initYouTube() {
  if (!youtube) youtube = await Innertube.create();
  return youtube;
}

export async function searchTracks(query) {
  try {
    const result = await yts(query);

    return result.videos.slice(0, 15).map(v => ({
      id: v.videoId,
      title: v.title,
      artist: v.author.name,
      duration: v.duration.seconds * 1000,
      thumbnail: v.thumbnail,
      source: "youtube"
    }));
  } catch (e) {
    console.error("yt-search falhou, tentando youtubei.js", e);
  }

  try {
    const yt = await initYouTube();
    const results = await yt.search(query);

    return results.videos.slice(0, 15).map(v => ({
      id: v.id,
      title: v.title,
      artist: v.author,
      duration: v.duration,
      thumbnail: v.best_thumbnail?.url,
      source: "youtube"
    }));
  } catch (err) {
    console.error("Erro ao buscar no YouTube:", err);
    return [];
  }
}

export async function getFastAudioUrl(videoId) {
  try {
    const yt = await initYouTube();
    const info = await yt.getInfo(videoId);

    const format = info?.streaming_data?.adaptive_formats?.find(
      f => f.mime_type.includes("audio/mp4") && f.bitrate
    );

    if (!format?.url) return null;

    return format.url;
  } catch (err) {
    console.error("Erro ao extrair URL direta:", err);
    return null;
  }
}
