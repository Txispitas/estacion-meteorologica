import React, { useState, useEffect, useRef } from 'react';
import { 
  Cloud, CloudRain, Sun, Wind, Droplets, Maximize, 
  CloudSnow, CloudLightning, Settings, Image as ImageIcon, X,
  Bell, BellRing, Music, RotateCcw, Calendar, Radio, Play, Square, Volume2, Signal, Pause, Power, ExternalLink, AlertTriangle, RefreshCw, Layers, CheckCircle, MapPin, Search, Navigation, ArrowUp, ArrowDown, Gauge, ChevronDown, Moon, FileAudio, Smartphone
} from 'lucide-react';

// ==========================================
// 1. CONSTANTES Y CONFIGURACIÓN
// ==========================================

// GALERÍA AMPLIADA (12 FOTOS) - Se mezclarán al inicio
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1501854140884-074cf2b2c3af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1534088568595-a066f410bcda?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
];

const RADIOS_XML_URL = "https://www.dropbox.com/scl/fi/6g2oybxzpg6n14yf0npxg/linksradios.xml?rlkey=hhmm8su5pux12xp3x9ntdevuj&st=ghtuckj0&dl=1";
const IMAGES_XML_URL = "https://www.dropbox.com/scl/fi/9hmotdxbjdnadl9a56kck/fondos.xml?rlkey=fvsho46ok5gbk0xtfd7eqj97a&st=ifpmpfeq&dl=1";
const SOUNDS_XML_URL = "https://www.dropbox.com/scl/fi/hkbqy6avwxhx08wrvb5zz/sonidos.xml?rlkey=yetcc8q3kfnjy3may1sk0awcg&st=mg8j14fs&dl=1";

const DEFAULT_ALARM_SOUNDS = [
  { name: "Pitido Digital", url: "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg" },
  { name: "Agua Relajante", url: "https://actions.google.com/sounds/v1/relaxing/river_sounds.ogg" }
];

// ESTACIONES POR DEFECTO (Actualizadas con tu nuevo link MP3)
const INITIAL_STATIONS = [
  { 
    name: "Radio Popular", 
    // NUEVO ENLACE MP3 DIRECTO
    url: "https://stream.mediasector.es/listen/radio_popular/radiopopular.mp3", 
    genre: "Herri Irratia Bilbao", 
    logo: "https://www.dropbox.com/scl/fi/ec32q7bvksi6owp2is41x/Radio-popular.jpg?rlkey=xg9feos4cechw0lkke4y972gq&st=6g7uulws&dl=1"
    // forceExternal ELIMINADO para que suene dentro
  },
  { name: "Rock FM", url: "https://rockfm-cope-rrcast.flumotion.com/cope/rockfm-low.mp3", genre: "Rock Clásico", logo: "https://www.dropbox.com/scl/fi/v42r0mvbneeefwdj5ssiu/Rock-FM.jpg?rlkey=uotl9msutnuz7apy06y527s4c&st=lwbvq50m&dl=1" },
  { name: "Cadena 100", url: "https://cadena100-cope-rrcast.flumotion.com/cope/cadena100-low.mp3", genre: "La mejor variedad", logo: "https://www.dropbox.com/scl/fi/6gaia8ed1q30otf48zi46/Cadena-100.jpg?rlkey=vx4xpii74lz2ir0tg35f3ui5b&st=rwfpkhuj&dl=1" },
  { name: "Kiss FM", url: "https://kissfm.kissfmradio.cires21.com/kissfm.mp3", genre: "Lo mejor de los 80 y 90", logo: "https://www.dropbox.com/scl/fi/nvlr5gtz1y7gm4frfahm2/Kiss-FM.jpg?rlkey=cd2bjgkn9yu9goo4xq50wniid&st=x60cunwo&dl=1" }
];

// ==========================================
// 2. FUNCIONES AUXILIARES
// ==========================================

const convertDropboxUrl = (url) => {
  if (!url || typeof url !== 'string') return "";
  if (url.includes("dl.dropboxusercontent.com")) return url;
  if (url.includes("dropbox.com")) {
    let newUrl = url.replace("www.dropbox.com", "dl.dropboxusercontent.com");
    newUrl = newUrl.replace(/[?&]dl=[01]/g, "");
    return newUrl; 
  }
  return url;
};

const safeLocalStorage = {
  getItem: (key) => {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  },
  setItem: (key, value) => {
    try { localStorage.setItem(key, value); } catch (e) {}
  }
};

const safeOpenWindow = (url) => {
  try {
    return window.open(url, '_blank');
  } catch (e) {
    console.error("Error abriendo ventana:", e);
    return null;
  }
};

const getWeatherDescription = (code) => {
    if (code === 0) return 'Despejado';
    if (code >= 1 && code <= 3) return 'Nublado';
    if (code >= 51 && code <= 67) return 'Lluvia';
    if (code >= 71 && code <= 77) return 'Nieve';
    if (code >= 95) return 'Tormenta';
    return 'Variable';
};

const getWeatherIconType = (code) => {
    if (code === 0) return 'sun';
    if (code >= 1 && code <= 3) return 'cloud';
    if (code >= 51 && code <= 67) return 'rain';
    if (code >= 71 && code <= 77) return 'snow';
    if (code >= 95) return 'storm';
    return 'cloud';
};

const getWeekNumber = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
};

const WeatherIcon = ({ type, className }) => {
    switch (type) {
      case 'sun': return <Sun className={className} />;
      case 'rain': return <CloudRain className={className} />;
      case 'snow': return <CloudSnow className={className} />;
      case 'storm': return <CloudLightning className={className} />;
      default: return <Cloud className={className} />;
    }
};

const MainWeatherIcon = ({ code, className }) => {
     const type = getWeatherIconType(code);
     return <WeatherIcon type={type} className={className} />;
};


// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================

export default function App() {
  const [time, setTime] = useState(new Date());
  
  // SCALING STATE
  const [scale, setScale] = useState(1);

  // Imágenes
  const [images, setImages] = useState(() => {
    return [...DEFAULT_IMAGES].sort(() => Math.random() - 0.5);
  }); 
  const [customImages, setCustomImages] = useState([]); 
  const [usingCustomImages, setUsingCustomImages] = useState(false); 
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Interfaz
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [showRadioModal, setShowRadioModal] = useState(false);
  
  // Clima
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Alarma
  const [alarmTime, setAlarmTime] = useState(() => safeLocalStorage.getItem('alarmTime') || "07:00");
  const [alarmEnabled, setAlarmEnabled] = useState(() => safeLocalStorage.getItem('alarmEnabled') === 'true');
  const [alarmType, setAlarmType] = useState(() => safeLocalStorage.getItem('alarmType') || 'sound');
  const [alarmStationName, setAlarmStationName] = useState(() => safeLocalStorage.getItem('alarmStationName') || INITIAL_STATIONS[1].name);
  const [alarmSoundUrl, setAlarmSoundUrl] = useState(() => safeLocalStorage.getItem('alarmSoundUrl') || DEFAULT_ALARM_SOUNDS[0].url);
  const [isRinging, setIsRinging] = useState(false);
  const [isTestingSound, setIsTestingSound] = useState(false);
  
  // Brillo
  const [brightness, setBrightness] = useState(100);
  const [schedEnabled, setSchedEnabled] = useState(() => safeLocalStorage.getItem('schedEnabled') === 'true');
  const [schedStart, setSchedStart] = useState(() => safeLocalStorage.getItem('schedStart') || "23:00");
  const [schedEnd, setSchedEnd] = useState(() => safeLocalStorage.getItem('schedEnd') || "07:00");
  const [dayBright, setDayBright] = useState(() => parseInt(safeLocalStorage.getItem('dayBright') || 100));
  const [nightBright, setNightBright] = useState(() => parseInt(safeLocalStorage.getItem('nightBright') || 10));

  // Radio y Vúmetro
  const [radioPlaying, setRadioPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState(null);
  const [radioVolume, setRadioVolume] = useState(1.0); 
  const [radioError, setRadioError] = useState(false);
  const [vizLevels, setVizLevels] = useState([10, 10, 10, 10]);
  
  // Datos Externos
  const [isUpdatingRadios, setIsUpdatingRadios] = useState(false);
  const [isUpdatingImages, setIsUpdatingImages] = useState(false); 
  const [xmlStatusMsg, setXmlStatusMsg] = useState(""); 
  
  const [stations, setStations] = useState(INITIAL_STATIONS);
  const [customSounds, setCustomSounds] = useState(DEFAULT_ALARM_SOUNDS);
  
  // Ubicación
  const [locationName, setLocationName] = useState(() => safeLocalStorage.getItem('locName') || 'Bilbao');
  const [coords, setCoords] = useState(() => {
      const savedLat = safeLocalStorage.getItem('locLat');
      const savedLon = safeLocalStorage.getItem('locLon');
      return savedLat && savedLon ? { lat: parseFloat(savedLat), lon: parseFloat(savedLon) } : { lat: 43.2630, lon: -2.9350 }; 
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fileInputRef = useRef(null);
  const audioRef = useRef(null);
  const radioRef = useRef(null);
  const externalWindowRef = useRef(null);

  // --- EFECTO VÚMETRO ---
  useEffect(() => {
    let interval;
    if (radioPlaying && !radioError) {
      interval = setInterval(() => {
        setVizLevels([
          Math.floor(Math.random() * 80) + 20,
          Math.floor(Math.random() * 80) + 20,
          Math.floor(Math.random() * 80) + 20,
          Math.floor(Math.random() * 80) + 20
        ]);
      }, 150);
    } else {
      setVizLevels([10, 10, 10, 10]);
    }
    return () => clearInterval(interval);
  }, [radioPlaying, radioError]);

  // --- LOGICA DE ESCALADO ---
  useEffect(() => {
    const handleResize = () => {
      const targetWidth = 1280;
      const targetHeight = 800;
      const scaleX = window.innerWidth / targetWidth;
      const scaleY = window.innerHeight / targetHeight;
      const newScale = Math.min(scaleX, scaleY);
      setScale(newScale);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- LOGICA DE NEGOCIO ---

  const handleAutoDetectLocation = async () => {
      setIsSearching(true);
      try {
        const response = await fetch('https://ipwho.is/');
        const data = await response.json();
        if (data.success) {
            const newCoords = { lat: data.latitude, lon: data.longitude };
            const cityName = data.city || "Ubicación WiFi";
            setCoords(newCoords);
            setLocationName(cityName);
            safeLocalStorage.setItem('locLat', newCoords.lat);
            safeLocalStorage.setItem('locLon', newCoords.lon);
            safeLocalStorage.setItem('locName', cityName);
            setIsSearching(false);
            setShowSettings(false);
        } else {
            throw new Error("Fallo IP");
        }
      } catch (err) {
          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                  (pos) => {
                      const newCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
                      setCoords(newCoords);
                      setLocationName("Ubicación GPS");
                      safeLocalStorage.setItem('locLat', newCoords.lat);
                      safeLocalStorage.setItem('locLon', newCoords.lon);
                      safeLocalStorage.setItem('locName', "Ubicación GPS");
                      setIsSearching(false);
                      setShowSettings(false);
                  },
                  () => { alert("No se pudo detectar ubicación."); setIsSearching(false); },
                  { timeout: 5000 }
              );
          } else {
              alert("No se pudo detectar ubicación.");
              setIsSearching(false);
          }
      }
  };

  const updateBrightness = () => {
      if (!schedEnabled) return;
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const [sh, sm] = schedStart.split(':').map(Number);
      const [eh, em] = schedEnd.split(':').map(Number);
      const startMinutes = sh * 60 + sm;
      const endMinutes = eh * 60 + em;
      let isNight = false;
      if (startMinutes < endMinutes) {
          isNight = currentMinutes >= startMinutes && currentMinutes < endMinutes;
      } else {
          isNight = currentMinutes >= startMinutes || currentMinutes < endMinutes;
      }
      const targetBrightness = isNight ? nightBright : dayBright;
      if (brightness !== targetBrightness) setBrightness(targetBrightness);
  };

  const toggleManualBrightness = () => {
      if (brightness > nightBright + 10) {
          setBrightness(nightBright);
      } else {
          setBrightness(dayBright);
      }
  };

  const saveSchedSettings = (enabled, start, end, dayB, nightB) => {
      setSchedEnabled(enabled);
      setSchedStart(start);
      setSchedEnd(end);
      setDayBright(dayB);
      setNightBright(nightB);
      safeLocalStorage.setItem('schedEnabled', enabled);
      safeLocalStorage.setItem('schedStart', start);
      safeLocalStorage.setItem('schedEnd', end);
      safeLocalStorage.setItem('dayBright', dayB);
      safeLocalStorage.setItem('nightBright', nightB);
      setTimeout(updateBrightness, 100);
  };

  const fetchStationsData = async () => {
    setIsUpdatingRadios(true);
    try {
      const response = await fetch(`${convertDropboxUrl(RADIOS_XML_URL)}&t=${new Date().getTime()}`);
      if (!response.ok) throw new Error("Error XML Radios");
      const text = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");
      
      const stationTags = xmlDoc.getElementsByTagName("station");
      if (stationTags.length > 0) {
        const newStations = [];
        for (let i = 0; i < stationTags.length; i++) {
          const name = stationTags[i].getAttribute("name");
          const url = stationTags[i].getAttribute("url");
          const logo = stationTags[i].getAttribute("logo");
          const isExternal = stationTags[i].getAttribute("external") === "true";
          
          if (name && url) {
            newStations.push({
              name: name,
              url: url,
              logo: logo || "",
              forceExternal: isExternal
            });
          }
        }
        if (newStations.length > 0) {
          setStations(newStations);
        }
      } else {
        // Fallback antiguo
        const links = xmlDoc.getElementsByTagName("link");
        const newLogos = {};
        for (let i = 0; i < links.length; i++) {
          const id = links[i].getAttribute("id") || links[i].getAttribute("name");
          const url = links[i].textContent.trim();
          if (id && url) newLogos[id] = url;
        }
        setStations(prev => prev.map(s => newLogos[s.name] ? { ...s, logo: newLogos[s.name] } : s));
      }
    } catch (err) {
      console.error("Error cargando radios XML:", err);
    } finally { 
      setTimeout(() => setIsUpdatingRadios(false), 500); 
    }
  };

  const fetchAlarmSounds = async () => {
    if (!SOUNDS_XML_URL) return;
    try {
      const response = await fetch(convertDropboxUrl(SOUNDS_XML_URL));
      if (!response.ok) throw new Error("Error XML Sonidos");
      const text = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");
      const links = xmlDoc.getElementsByTagName("link");
      const newSounds = [];
      for (let i = 0; i < links.length; i++) {
        const name = links[i].getAttribute("name") || links[i].getAttribute("id") || "Sonido " + (i+1);
        const url = links[i].textContent.trim();
        if (url) newSounds.push({ name, url });
      }
      if (newSounds.length > 0) {
          setCustomSounds(newSounds);
          if (!newSounds.find(s => s.url === alarmSoundUrl)) setAlarmSoundUrl(newSounds[0].url);
      }
    } catch (err) {}
  };

  const fetchBackgroundImages = async () => {
    if (!IMAGES_XML_URL) return;
    setIsUpdatingImages(true);
    setXmlStatusMsg("Conectando...");
    try {
      const response = await fetch(convertDropboxUrl(IMAGES_XML_URL));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");
      let imageTags = xmlDoc.getElementsByTagName("image");
      if (imageTags.length === 0) imageTags = xmlDoc.getElementsByTagName("link");
      const newImages = [];
      for (let i = 0; i < imageTags.length; i++) {
        const url = imageTags[i].textContent.trim();
        if (url) newImages.push(url);
      }
      if (newImages.length > 0) {
        setCustomImages(newImages);
        setImages(newImages);
        setUsingCustomImages(true);
        setXmlStatusMsg(`¡OK! ${newImages.length} fotos.`);
      } else { throw new Error(); }
    } catch (err) { setXmlStatusMsg("Error al cargar XML."); } 
    finally { setTimeout(() => setIsUpdatingImages(false), 500); }
  };

  const toggleImageSource = () => {
    if (usingCustomImages) {
      setImages(DEFAULT_IMAGES);
      setUsingCustomImages(false);
      setCurrentImageIndex(0);
      setXmlStatusMsg(""); 
    } else {
      if (customImages.length > 0) {
        setImages(customImages);
        setUsingCustomImages(true);
        setCurrentImageIndex(0);
        setXmlStatusMsg(`Usando ${customImages.length} fotos guardadas.`);
      } else {
        fetchBackgroundImages();
      }
    }
    setShowSettings(false); 
  };

  const handleSearchLocation = async () => {
      if (!searchQuery.trim()) return;
      setIsSearching(true);
      try {
          const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=1&language=es&format=json`);
          const data = await response.json();
          if (data.results && data.results.length > 0) {
              const result = data.results[0];
              const newCoords = { lat: result.latitude, lon: result.longitude };
              setCoords(newCoords);
              setLocationName(result.name);
              safeLocalStorage.setItem('locLat', result.latitude);
              safeLocalStorage.setItem('locLon', result.longitude);
              safeLocalStorage.setItem('locName', result.name);
              setSearchQuery(""); 
              setShowSettings(false); 
          } else {
              alert("No se encontró ninguna ubicación con ese código o nombre.");
          }
      } catch (e) {
          console.error("Error geocoding:", e);
          alert("Error al buscar la ubicación.");
      } finally {
          setIsSearching(false);
      }
  };

  const handleUseGPS = () => {
      setIsSearching(true);
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              (pos) => {
                  const newCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
                  setCoords(newCoords);
                  setLocationName("Ubicación Actual");
                  safeLocalStorage.setItem('locLat', newCoords.lat);
                  safeLocalStorage.setItem('locLon', newCoords.lon);
                  safeLocalStorage.setItem('locName', "Ubicación Actual");
                  setIsSearching(false);
                  setShowSettings(false);
              },
              (err) => {
                  console.error(err);
                  alert("No se pudo obtener la ubicación GPS.");
                  setIsSearching(false);
              }
          );
      } else {
          alert("Tu navegador no soporta GPS.");
          setIsSearching(false);
      }
  };
  
  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(newImageUrls);
      setIsLocalImage(true);
      setCurrentImageIndex(0);
      setShowSettings(false);
    }
  };
  
  const resetImages = () => {
    setImages(DEFAULT_IMAGES);
    setIsLocalImage(false);
    setCurrentImageIndex(0);
  };

  useEffect(() => {
    fetchStationsData(); // Carga inicial de radios
    fetchBackgroundImages();
    fetchAlarmSounds();
    updateBrightness();
    if (!safeLocalStorage.getItem('locLat')) handleAutoDetectLocation();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      if (alarmEnabled && !isRinging) {
        const currentTimeString = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        if (currentTimeString === alarmTime && now.getSeconds() === 0) {
          triggerAlarm();
        }
      }
      if (now.getSeconds() === 0) {
          updateBrightness();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [alarmEnabled, alarmTime, isRinging, alarmType, alarmStationName, alarmSoundUrl, schedEnabled, schedStart, schedEnd, dayBright, nightBright, brightness]);

  useEffect(() => {
    if (images.length <= 1) return;
    const imageTimer = setInterval(() => setCurrentImageIndex(p => (p + 1) % images.length), 60000); 
    return () => clearInterval(imageTimer);
  }, [images]);

  const testSound = (url) => {
    if (!audioRef.current) return;
    if (isTestingSound) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsTestingSound(false);
    } else {
        audioRef.current.src = convertDropboxUrl(url);
        audioRef.current.volume = 1.0;
        audioRef.current.loop = false; 
        audioRef.current.load();
        audioRef.current.play().then(() => setIsTestingSound(true)).catch(() => alert("Error sonido."));
    }
  };

  const triggerAlarm = () => {
    setBrightness(dayBright); 
    setIsRinging(true);
    if (alarmType === 'radio') {
      const stationToPlay = stations.find(s => s.name === alarmStationName) || stations[0];
      if (currentStation?.name !== stationToPlay.name || !radioPlaying) {
          toggleRadio(stationToPlay);
      }
    } else {
      if (radioPlaying) toggleRadio(null);
      if (audioRef.current) {
        audioRef.current.src = convertDropboxUrl(alarmSoundUrl);
        audioRef.current.volume = 1.0;
        audioRef.current.load();
        audioRef.current.loop = true;
        audioRef.current.play().catch(console.error);
      }
    }
  };

  const stopAlarm = () => {
    setIsRinging(false);
    if (alarmType === 'radio') {
        toggleRadio(null);
    } else {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
    }
  };

  const saveAlarmSettings = (newTime, enabled, type, station, soundUrl) => {
    setAlarmTime(newTime);
    setAlarmEnabled(enabled);
    setAlarmType(type);
    setAlarmStationName(station);
    setAlarmSoundUrl(soundUrl);
    safeLocalStorage.setItem('alarmTime', newTime);
    safeLocalStorage.setItem('alarmEnabled', enabled);
    safeLocalStorage.setItem('alarmType', type);
    safeLocalStorage.setItem('alarmStationName', station);
    safeLocalStorage.setItem('alarmSoundUrl', soundUrl);
  };

  const toggleRadio = (station) => {
    if (!radioRef.current) return;
    setRadioError(false);

    if (station && station.forceExternal) {
        if (radioPlaying) radioRef.current.pause();
        setRadioPlaying(false);
        if (externalWindowRef.current && !externalWindowRef.current.closed) externalWindowRef.current.close();
        setCurrentStation(station); 
        externalWindowRef.current = safeOpenWindow(station.url);
        return;
    }

    if (currentStation === station && radioPlaying) {
      radioRef.current.pause();
      setRadioPlaying(false);
      return;
    }
    
    if (station === null) {
      radioRef.current.pause();
      setRadioPlaying(false);
      setCurrentStation(null);
      radioRef.current.removeAttribute('src'); 
      radioRef.current.load(); 
      if (externalWindowRef.current && !externalWindowRef.current.closed) {
          externalWindowRef.current.close();
          externalWindowRef.current = null;
      }
      return;
    }

    if (externalWindowRef.current && !externalWindowRef.current.closed) {
        externalWindowRef.current.close();
        externalWindowRef.current = null;
    }

    setCurrentStation(station);
    setRadioPlaying(true);
    radioRef.current.src = station.url;
    radioRef.current.volume = radioVolume;
    
    const playPromise = radioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.then(() => console.log("Radio iniciada")).catch(error => console.error("Error radio:", error));
    }
  };

  const changeRadioVolume = (val) => {
    setRadioVolume(val);
    if (radioRef.current) radioRef.current.volume = val;
  };

  const fetchWeather = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      const data = await response.json();
      const currentWeather = {
        temp: Math.round(data.current.temperature_2m),
        min: Math.round(data.daily.temperature_2m_min[0]),
        max: Math.round(data.daily.temperature_2m_max[0]),
        humidity: data.current.relative_humidity_2m,
        wind: Math.round(data.current.wind_speed_10m),
        pressure: Math.round(data.current.surface_pressure),
        code: data.current.weather_code,
        condition: getWeatherDescription(data.current.weather_code),
      };
      const forecast = data.daily.time.slice(1, 8).map((dateStr, index) => {
        const code = data.daily.weather_code[index + 1];
        const maxTemp = Math.round(data.daily.temperature_2m_max[index + 1]);
        const date = new Date(dateStr);
        const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
        return { day: dayName, temp: maxTemp, code: code, icon: getWeatherIconType(code) };
      });
      setWeather({ current: currentWeather, forecast: forecast });
      setLoading(false);
    } catch (err) {
      setError("Error clima");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(coords.lat, coords.lon);
    const weatherInterval = setInterval(() => {
        fetchWeather(coords.lat, coords.lon);
    }, 1800000);
    return () => clearInterval(weatherInterval);
  }, [coords]); 

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.log(e));
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="w-screen h-screen bg-black overflow-hidden flex items-center justify-center font-sans relative selection:bg-none">
      <audio ref={audioRef} preload="auto" onEnded={() => setIsTestingSound(false)} />
      <audio ref={radioRef} preload="none" onError={() => setRadioError(true)} onPlaying={() => setRadioError(false)} />
      
      <div 
        style={{ 
          width: '1280px', 
          height: '800px', 
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }}
        className="relative bg-zinc-900 text-white overflow-hidden shadow-2xl flex-shrink-0"
      >
        
        <div className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-1000 z-40" style={{ opacity: (100 - brightness) / 100 }} />

        {isRinging && (
          <div className="fixed inset-0 z-[100] bg-red-600 flex flex-col items-center justify-center animate-pulse">
            <div className="bg-black/90 p-12 rounded-3xl text-center border-4 border-white">
              <h1 className="text-6xl font-bold mb-4">¡BUENOS DÍAS!</h1>
              <p className="text-2xl text-gray-300 mb-8">
                  {alarmType === 'radio' ? `Sonando: ${alarmStationName}` : 'Es hora de despertar'}
              </p>
              <button onClick={stopAlarm} className="px-12 py-6 bg-white text-black text-3xl font-bold rounded-full shadow-xl">DETENER</button>
            </div>
          </div>
        )}

        <div className="absolute inset-0 z-0 bg-zinc-900">
          {images.map((img, index) => (
            <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}>
              <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover blur-lg opacity-40 scale-105" />
              <img src={img} alt="Fondo" className="absolute inset-0 w-full h-full object-contain z-10"/>
            </div>
          ))}
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        </div>

        <div className="absolute top-0 right-0 p-4 z-50 flex items-center space-x-3 text-white w-full justify-end">
            <button onClick={toggleManualBrightness} className={`p-2 rounded-full ${brightness < 50 ? 'bg-blue-600 text-white shadow-lg' : 'bg-black/50 hover:bg-black/70 backdrop-blur-sm'}`}>{brightness < 50 ? <Moon size={20} /> : <Sun size={20} />}</button>
            <button onClick={() => setShowRadioModal(true)} className={`p-2 rounded-full ${radioPlaying ? 'bg-blue-600 text-white shadow-lg' : 'bg-black/50 hover:bg-black/70 backdrop-blur-sm'}`}>{radioPlaying ? <Signal size={20} className="animate-pulse"/> : <Radio size={20} />}</button>
            <button onClick={() => setShowAlarmModal(true)} className={`flex items-center space-x-2 px-3 py-2 rounded-full ${alarmEnabled ? 'bg-yellow-500 text-black shadow-lg' : 'bg-black/50 hover:bg-black/70 backdrop-blur-sm'}`}>{alarmEnabled && <span>{alarmTime}</span>}<Bell size={20}/></button>
            <button onClick={() => setShowSettings(true)} className="p-2 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm"><Settings size={20} /></button>
            <button onClick={toggleFullscreen} className="ml-2 p-2 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm"><Maximize size={20} /></button>
        </div>

        {/* Modales */}
        {showRadioModal && (
          <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-zinc-900 p-4 rounded-2xl w-full max-w-sm space-y-4 border border-zinc-700">
              <div className="flex justify-between"><h2 className="text-xl font-bold">Radio</h2><button onClick={() => setShowRadioModal(false)}><X/></button></div>
              <div className="flex items-center justify-between mb-2"><button onClick={fetchStationsData} className="text-xs flex items-center gap-1 text-blue-400"><RefreshCw size={12}/> Actualizar</button></div>
              {radioError && <div className="text-xs text-amber-400 flex gap-2"><AlertTriangle size={14}/> Error de stream. Usa modo externo.</div>}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                  {stations && stations.map((s, i) => (
                    <button key={i} onClick={() => { toggleRadio(s); setShowRadioModal(false); }} className="w-full p-3 bg-zinc-800 rounded-xl flex items-center gap-3 hover:bg-zinc-700">
                      <img src={s.logo} className="w-8 h-8 rounded bg-white/10 object-cover" alt=""/>
                      <div className="text-left flex-1"><p className="font-bold text-sm">{s.name}</p></div>
                      {s.forceExternal && <ExternalLink size={14} className="text-zinc-500"/>}
                    </button>
                  ))}
              </div>
              <div className="flex items-center gap-2 bg-zinc-800 p-2 rounded-xl">
                  <Volume2 size={18} className="text-zinc-400"/>
                  <input type="range" min="0" max="1" step="0.1" value={radioVolume} onChange={(e) => {setRadioVolume(parseFloat(e.target.value)); if(radioRef.current) radioRef.current.volume=parseFloat(e.target.value);}} className="w-full h-1 bg-zinc-600 rounded-lg cursor-pointer"/>
              </div>
              {(radioPlaying || radioError) && <button onClick={() => toggleRadio(null)} className="w-full py-3 bg-red-900/50 text-red-300 rounded-xl font-bold flex justify-center gap-2"><Square size={16} fill="currentColor"/> APAGAR</button>}
            </div>
          </div>
        )}

        {showSettings && (
          <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-zinc-900 p-4 rounded-2xl w-full max-w-sm space-y-4 border border-zinc-700 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between"><h2 className="text-xl font-bold">Ajustes</h2><button onClick={() => setShowSettings(false)}><X/></button></div>
              
              <div className="bg-zinc-800 p-3 rounded-xl space-y-3">
                  <div className="flex justify-between items-center"><span className="text-sm font-bold flex gap-2"><Moon size={16} className="text-blue-400"/> Modo Noche</span>
                  <button onClick={() => saveSchedSettings(!schedEnabled, schedStart, schedEnd, dayBright, nightBright)} className={`w-10 h-5 rounded-full relative ${schedEnabled ? 'bg-green-600' : 'bg-zinc-600'}`}><span className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${schedEnabled ? 'left-6' : 'left-1'}`} /></button></div>
                  {schedEnabled && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><label>Inicio</label><input type="time" value={schedStart} onChange={(e)=>saveSchedSettings(true,e.target.value,schedEnd,dayBright,nightBright)} className="w-full bg-zinc-900 p-1 rounded"/></div>
                        <div><label>Fin</label><input type="time" value={schedEnd} onChange={(e)=>saveSchedSettings(true,schedStart,e.target.value,dayBright,nightBright)} className="w-full bg-zinc-900 p-1 rounded"/></div>
                        <div className="col-span-2 space-y-1"><div className="flex justify-between"><span>Día</span><span>{dayBright}%</span></div><input type="range" min="10" max="100" value={dayBright} onChange={(e)=>saveSchedSettings(true,schedStart,schedEnd,parseInt(e.target.value),nightBright)} className="w-full h-1 bg-zinc-600"/></div>
                        <div className="col-span-2 space-y-1"><div className="flex justify-between"><span>Noche</span><span>{nightBright}%</span></div><input type="range" min="0" max="100" value={nightBright} onChange={(e)=>saveSchedSettings(true,schedStart,schedEnd,dayBright,parseInt(e.target.value))} className="w-full h-1 bg-zinc-600"/></div>
                    </div>
                  )}
              </div>

              <div className="space-y-2">
                  <label className="text-sm text-zinc-400 font-bold flex items-center space-x-2"><MapPin size={16}/> <span>Buscar Ubicación</span></label>
                  <div className="flex space-x-2"><input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Ciudad o CP" className="flex-1 bg-zinc-800 text-white p-3 rounded-xl border border-zinc-600"/><button onClick={handleSearchLocation} disabled={isSearching} className="bg-blue-600 hover:bg-blue-500 p-3 rounded-xl text-white disabled:opacity-50">{isSearching ? <RefreshCw size={20} className="animate-spin"/> : <Search size={20}/>}</button></div>
                  <button onClick={handleAutoDetectLocation} className="text-xs text-blue-400 underline flex gap-1 items-center"><Navigation size={10}/> Usar ubicación auto (WiFi)</button>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-700">
                  <button onClick={fetchBackgroundImages} disabled={isUpdatingImages} className={`w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl flex items-center justify-center space-x-2 font-bold border border-zinc-600 ${isUpdatingImages ? 'opacity-70' : ''}`}><RefreshCw size={18} className={isUpdatingImages ? 'animate-spin' : ''} /> <span>{isUpdatingImages ? 'Actualizando...' : 'Recargar XML Fondos'}</span></button>
                  {xmlStatusMsg && <div className={`text-xs text-center p-2 rounded-lg border ${xmlStatusMsg.includes("Error") ? 'bg-red-900/30 border-red-800 text-red-300' : 'bg-green-900/30 border-green-800 text-green-300'}`}>{xmlStatusMsg}</div>}
              </div>
              <button onClick={toggleImageSource} className={`w-full py-3 rounded-xl flex items-center justify-center space-x-2 font-bold transition-colors ${usingCustomImages ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>{usingCustomImages ? <><Layers size={18} /><span>Cambiar a Fotos Aleatorias</span></> : <><ImageIcon size={18} /><span>Usar Mis Fotos</span></>}</button>
              {usingCustomImages && <div className="flex items-center justify-center space-x-2 text-xs text-zinc-400"><CheckCircle size={12} className="text-green-500" /><span>{customImages.length} fotos cargadas.</span></div>}
              
              <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 bg-blue-600 rounded-xl flex items-center justify-center space-x-2 font-bold text-white"><ImageIcon size={18}/> <span>Subir Localmente</span></button>
              <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload}/>

              <button onClick={() => setShowSettings(false)} className="w-full py-3 mt-2 bg-green-600 hover:bg-green-500 rounded-xl text-white font-bold shadow-lg transition-transform active:scale-95">Aceptar</button>
            </div>
          </div>
        )}

        {showAlarmModal && (
          <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-sm space-y-6 border border-zinc-700 shadow-2xl">
              <div className="flex justify-between"><h2 className="text-xl font-bold">Alarma</h2><button onClick={() => setShowAlarmModal(false)}><X/></button></div>
              <div className="flex justify-center"><input type="time" value={alarmTime} onChange={(e) => saveAlarmSettings(e.target.value, alarmEnabled, alarmType, alarmStationName, alarmSoundUrl)} className="bg-zinc-800 text-5xl p-4 rounded-xl text-center w-full"/></div>
              
              <div className="bg-zinc-800 p-1 rounded-xl flex gap-1">
                  <button onClick={() => saveAlarmSettings(alarmTime, alarmEnabled, 'sound', alarmStationName, alarmSoundUrl)} className={`flex-1 py-2 rounded-lg flex justify-center gap-2 text-sm ${alarmType==='sound'?'bg-blue-600':'text-zinc-400'}`}><FileAudio size={16}/> Audio</button>
                  <button onClick={() => saveAlarmSettings(alarmTime, alarmEnabled, 'radio', alarmStationName, alarmSoundUrl)} className={`flex-1 py-2 rounded-lg flex justify-center gap-2 text-sm ${alarmType==='radio'?'bg-green-600':'text-zinc-400'}`}><Radio size={16}/> Radio</button>
              </div>

              {alarmType === 'sound' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400 font-bold"><span>Sonido:</span> <button onClick={fetchAlarmSounds} className="text-blue-400 flex gap-1 items-center"><RefreshCw size={10}/> XML</button></div>
                  <div className="flex gap-2">
                      <div className="relative flex-grow">
                          <select value={alarmSoundUrl} onChange={(e)=>saveAlarmSettings(alarmTime, alarmEnabled, 'sound', alarmStationName, e.target.value)} className="w-full bg-zinc-800 p-3 rounded-xl appearance-none border border-zinc-600 text-white font-medium pr-8 text-sm truncate focus:border-blue-500 outline-none">
                              {customSounds.map((s,i)=><option key={i} value={s.url}>{s.name}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-3.5 text-zinc-500 pointer-events-none" size={16}/>
                      </div>
                      <button onClick={() => testSound(alarmSoundUrl)} className={`p-3 rounded-xl transition-colors ${isTestingSound?'bg-red-500 text-white shadow-lg animate-pulse':'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'}`} title={isTestingSound ? "Parar prueba" : "Probar sonido"}>
                          {isTestingSound ? <Square size={20} fill="currentColor"/> : <Play size={20} fill="currentColor"/>}
                      </button>
                  </div>
                </div>
              )}

              {alarmType === 'radio' && (
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-bold">Emisora:</label>
                  <div className="relative">
                      <select value={alarmStationName} onChange={(e)=>saveAlarmSettings(alarmTime, alarmEnabled, 'radio', e.target.value, alarmSoundUrl)} className="w-full bg-zinc-800 p-3 rounded-xl appearance-none border border-zinc-600 text-white font-medium pr-8 text-sm focus:border-green-500 outline-none">
                          {stations.map((s,i)=><option key={i} value={s.name}>{s.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 text-zinc-500 pointer-events-none" size={16}/>
                  </div>
                </div>
              )}
              
              <button onClick={() => {saveAlarmSettings(alarmTime, !alarmEnabled, alarmType, alarmStationName, alarmSoundUrl); setShowAlarmModal(false);}} className={`w-full py-3 rounded-xl font-bold ${alarmEnabled ? 'bg-red-900/50 text-red-200 border border-red-500/50' : 'bg-green-600'}`}>{alarmEnabled ? 'DESACTIVAR' : 'ACTIVAR'}</button>
            </div>
          </div>
        )}

        <div className="relative z-10 flex flex-row h-full w-full p-8 pt-8 pb-2">
          
          <div className="w-5/12 flex flex-col justify-between mb-0 h-full">
            
            <div className="space-y-2">
              <div className="space-y-2 -mt-6">
                <h1 className="text-[10rem] font-bold tracking-tighter leading-none whitespace-nowrap">{time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</h1>
                <div className="ml-2">
                  <p className="text-3xl font-light text-gray-200 capitalize">{time.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                  <p className="text-lg text-yellow-500/80 font-medium flex items-center space-x-2 mt-1"><Calendar size={16} /> <span>Semana {getWeekNumber(time)}</span></p>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-4 justify-end mt-auto">
              
              {currentStation && (
                <div className="w-full max-w-sm h-20">
                  <div className="bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center justify-between w-full h-full">
                    <div className="flex items-center space-x-4 min-w-0 flex-1">
                      <div className="relative flex-shrink-0"><img src={currentStation.logo} alt={currentStation.name} className="w-14 h-14 rounded-xl object-cover bg-white/10 shadow-lg" />{radioPlaying && !radioError && !currentStation.forceExternal && <div className="absolute inset-0 flex items-center justify-center"><div className="w-2 h-2 bg-blue-500 rounded-full absolute top-0 right-0 m-1"></div></div>}</div>
                      <div className="flex flex-col overflow-hidden">
                        {radioError ? <span className="text-xs font-bold text-amber-400 flex items-center space-x-1 truncate"><AlertTriangle size={12} /> <span>REQUIERE ACCIÓN</span></span> : <span className="text-[10px] text-blue-400 font-bold tracking-wider uppercase flex items-center space-x-1">{radioPlaying ? (currentStation.forceExternal ? <><ExternalLink size={10} /> <span>REPRODUCIENDO FUERA</span></> : <><Signal size={10} /> <span>EN VIVO</span></>) : <span className="text-zinc-500">PAUSADO</span>}</span>}
                        <span className="text-lg font-bold text-white leading-tight truncate">{currentStation.name}</span>
                        {radioError && <a href={currentStation.url} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-300 hover:underline flex items-center space-x-1 mt-1"><ExternalLink size={10} /> <span>Abrir Externamente</span></a>}
                      </div>
                    </div>
                    
                    {/* Vúmetro entre texto y botones */}
                    <div className="flex items-end gap-1 h-8 mx-4" aria-hidden="true">
                      {vizLevels.map((level, idx) => (
                        <div 
                          key={idx} 
                          className="w-1.5 bg-green-400 rounded-t transition-all duration-150 ease-out" 
                          style={{ height: `${level}%` }} 
                        />
                      ))}
                    </div>

                    <div className="flex items-center space-x-2 pl-2">
                      {!radioError && !currentStation.forceExternal && <button onClick={() => toggleRadio(currentStation)} className="p-3 bg-white/10 rounded-full text-white">{radioPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}</button>}
                      <button onClick={() => toggleRadio(null)} className="p-3 bg-red-900/30 text-red-400 rounded-full border border-red-500/20"><Power size={20} /></button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-xl w-full max-w-sm h-52 flex flex-col justify-center">
                {loading ? <div className="h-full flex items-center justify-center"><p>Cargando...</p></div> : error ? <div className="h-full flex items-center justify-center text-red-300"><p>{error}</p></div> : (
                  <>
                    <h3 className="text-[15px] font-bold uppercase text-gray-300 mb-2 border-b border-white/10 pb-2 flex-shrink-0">EL TIEMPO EN {locationName.toUpperCase()}</h3>
                    <div className="flex items-center justify-between w-full flex-grow">
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center space-x-4"><span className="text-5xl font-semibold tracking-tighter">{weather.current.temp}°</span><div className="flex flex-col space-y-1"><span className="flex items-center text-red-300 text-base font-bold"><ArrowUp size={16} className="mr-1"/>{weather.current.max}°</span><span className="flex items-center text-blue-300 text-base font-bold"><ArrowDown size={16} className="mr-1"/>{weather.current.min}°</span></div></div>
                      </div>
                      <div className="flex flex-col items-center justify-center px-2"><Gauge size={32} className="text-green-400 mb-1 opacity-80"/><span className="text-xl font-bold text-green-100">{weather.current.pressure} <span className="text-sm">hPa</span></span></div>
                      <div className="flex flex-col items-center mr-2"><MainWeatherIcon code={weather.current.code} className="w-10 h-10 text-yellow-400 mb-2" /><span className="block text-xs text-gray-300 font-medium text-center mb-1">{weather.current.condition}</span></div>
                    </div>
                    <div className="flex space-x-4 mt-4 w-full">
                      <div className="flex-1 flex items-center justify-center space-x-3 bg-black/20 p-3 rounded-2xl">
                        <Droplets className="text-blue-400 w-8 h-8" />
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider">Humedad</p>
                          <p className="text-2xl font-bold">{weather.current.humidity}<span className="text-sm font-normal">%</span></p>
                        </div>
                      </div>
                      <div className="flex-1 flex items-center justify-center space-x-3 bg-black/20 p-3 rounded-2xl">
                        <Wind className="text-gray-400 w-8 h-8" />
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider">Viento</p>
                          <p className="text-2xl font-bold">{weather.current.wind} <span className="text-sm font-normal">km/h</span></p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {!loading && weather && (
                <div className="bg-black/40 backdrop-blur-md p-3 rounded-3xl border border-white/5 shadow-2xl w-full max-w-md h-40 flex flex-col">
                  <h3 className="text-[15px] font-bold uppercase text-gray-300 mb-1 border-b border-white/10 pb-2 flex-shrink-0">PRONÓSTICO 7 DÍAS PARA {locationName.toUpperCase()}</h3>
                  <div className="flex overflow-x-auto pb-2 scrollbar-hide justify-between space-x-4 flex-grow items-center">
                    {weather.forecast.map((day, idx) => (
                      <div key={idx} className="flex flex-col items-center space-y-1 min-w-[50px] flex-shrink-0"><span className="text-gray-300 capitalize text-xs font-medium">{day.day}</span><WeatherIcon type={day.icon} className="w-6 h-6 text-white" /><span className="text-lg font-bold">{day.temp}°</span></div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          <div className="w-7/12 h-full">
             {/* Espacio libre para la foto */}
          </div>
        </div>

      </div>
    </div>
  );
}