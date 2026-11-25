document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;

  // STORAGE KEYS
  const STORAGE_PROFILE_KEY = "aerolover_user_profile";
  const STORAGE_PREFS_KEY = "aerolover_user_prefs";
  const STORAGE_PAYMENT_KEY = "aerolover_user_payment";
  const STORAGE_ACCOUNTS_KEY = "aerolover_registered_accounts";
  const STORAGE_REMEMBER_KEY = "aerolover_remember_me";
  const STORAGE_REMEMBER_EMAIL_KEY = "aerolover_remember_email";
  const STORAGE_LOGOUT_EVENT_KEY = "aerolover_logout_event";
  const STORAGE_RESET_TOKENS_KEY = "aerolover_password_reset_tokens";
  const STORAGE_LANG_KEY = "aerolover_lang";

  // Dynamic secret passcode fallback
  let SECRET_PASSCODE = localStorage.getItem("aerolover_passcode") || "skyhigh";

  // ==========================================
  // 0. FULL-PAGE TRANSLATION ENGINE (EN / PT / ES)
  // ==========================================
  const translations = {
    en: {
      label: "EN",
      page_title: "Aerolover - Aviation Insights & Fleet Analytics",
      menu_heading: "Menu",
      nav_home: "Home",
      nav_aviation: "Aviation",
      nav_airlines: "Airlines",
      nav_airlines_icon: "✈️ Airlines",
      nav_airports: "Airports",
      nav_airports_icon: "🛫 Airports",
      nav_airspace: "Airspace",
      nav_airspace_icon: "📡 Airspace",
      nav_news_tech: "News & Tech",
      nav_latest_news: "Latest News",
      nav_latest_news_icon: "📰 Latest News",
      nav_sustainability: "Sustainability",
      nav_sustainability_icon: "🌱 Sustainability",
      nav_technology: "Technology",
      nav_technology_icon: "🛰️ Technology",
      nav_plans: "Plans",
      nav_contact: "Contact",
      nav_account: "Account",
      nav_signin: "Sign In",
      nav_signup: "Sign Up",
      search_placeholder: "Search...",
      search_btn: "Go",
      hero_badge_1: "✈️ Global Aviation Intelligence",
      hero_badge_2: "Fleets • Hubs • SAF",
      hero_title:
        "Your Premier Destination for Aviation Insights & Analytics",
      hero_subtitle:
        "Track global airline fleets, explore international airport developments, and stay updated with breaking aerospace news.",
      hero_cta_primary: "Get Started Free",
      hero_cta_secondary: "Explore VIP Plans",
      hero_check_1: "✓ Commercial Fleet Specs",
      hero_check_2: "✓ Airport Expansion Briefings",
      hero_check_3: "✓ Next-Gen Avionics & SAF",
      radar_title: "AEROSPACE RADAR",
      radar_sub: "Live Industry Coverage & Fleet Briefings",
      radar_btn: "Explore",
      news_eyebrow: "Breaking Headlines",
      news_heading: "Featured Aviation News",
      news_view_all: "View All News →",
      slide1_badge: "Airlines",
      slide1_title: "Next-Gen Commercial Fleet Upgrades Announced",
      slide1_desc:
        "Major international carriers place multibillion-dollar orders for fuel-efficient wide-body jets to modernize long-haul networks.",
      slide2_badge: "Airports",
      slide2_title: "Smart Biometric Terminals Open Worldwide",
      slide2_desc:
        "International airport hubs integrate automated facial recognition security lines to cut passenger check-in processing times by up to 40%.",
      slide3_badge: "Technology",
      slide3_title: "100% SAF Transatlantic Crossing Successful",
      slide3_desc:
        "A landmark flight completes a transatlantic flight powered entirely by 100% Sustainable Aviation Fuel without engine modifications.",
      read_full_story: "Read Full Story",
      sectors_eyebrow: "Industry Sectors",
      sectors_heading: "Explore Commercial Aviation",
      sectors_subtitle: "In-depth coverage across key industry sectors.",
      card_airlines_title: "Airlines & Fleets",
      card_airlines_desc:
        "Detailed breakdowns of wide-body deliveries, cabin configurations, and route expansions.",
      card_airlines_btn: "View Airlines →",
      card_airports_title: "Airports & Terminals",
      card_airports_desc:
        "Coverage of new runway construction, terminal modernizations, and biometric check-in rollouts.",
      card_airports_btn: "View Airports →",
      card_airspace_title: "Airspace & ATC",
      card_airspace_desc:
        "Insights into controlled airspace sectors, oceanic corridors, and space-based ADS-B tracking.",
      card_airspace_btn: "View Airspace →",
      card_tech_title: "Aerospace Tech & SAF",
      card_tech_desc:
        "Updates on Sustainable Aviation Fuel testing, hydrogen propulsion, and next-gen avionics.",
      card_tech_btn: "View Tech →",
      vip_badge: "🎫 First-Class Lounge",
      vip_title:
        "Unlock Fleet Order Trackers, 4K Wallpapers & Early Cabin Reports",
      vip_desc:
        "Create a free Aerolover account or upgrade to Exclusive Access for insider aviation briefings and partner lounge perks.",
      vip_btn_plans: "Compare Plans",
      vip_btn_signup: "Create Free Account",
      footer_about:
        "Your ultimate portal for aviation news, airport updates, airline fleet specs, and future aerospace technologies.",
      footer_nav_heading: "Navigation",
      footer_benefits_heading: "Benefits",
      footer_exclusive: "Exclusive Access",
      footer_connect_heading: "Connect",
      footer_location: "📍 Worldwide Aviation Network",
      footer_copyright:
        "© 2026 Aerolover. Built with Bootstrap 5 & Vanilla JS.",
      footer_privacy: "Privacy Policy",
      footer_terms: "Terms of Service",
    },
    pt: {
      label: "PT",
      page_title: "Aerolover - Inteligência e Análise da Aviação",
      menu_heading: "Menu",
      nav_home: "Início",
      nav_aviation: "Aviação",
      nav_airlines: "Companhias Aéreas",
      nav_airlines_icon: "✈️ Companhias Aéreas",
      nav_airports: "Aeroportos",
      nav_airports_icon: "🛫 Aeroportos",
      nav_airspace: "Espaço Aéreo",
      nav_airspace_icon: "📡 Espaço Aéreo",
      nav_news_tech: "Notícias e Tech",
      nav_latest_news: "Últimas Notícias",
      nav_latest_news_icon: "📰 Últimas Notícias",
      nav_sustainability: "Sustentabilidade",
      nav_sustainability_icon: "🌱 Sustentabilidade",
      nav_technology: "Tecnologia",
      nav_technology_icon: "🛰️ Tecnologia",
      nav_plans: "Planos",
      nav_contact: "Contato",
      nav_account: "Conta",
      nav_signin: "Entrar",
      nav_signup: "Criar Conta",
      search_placeholder: "Pesquisar...",
      search_btn: "Ir",
      hero_badge_1: "✈️ Inteligência Global da Aviação",
      hero_badge_2: "Frotas • Hubs • SAF",
      hero_title:
        "Seu Principal Portal de Inteligência e Análise da Aviação",
      hero_subtitle:
        "Acompanhe frotas globais, explore expansões de aeroportos internacionais e fique por dentro das novidades aeroespaciais.",
      hero_cta_primary: "Começar Grátis",
      hero_cta_secondary: "Ver Planos VIP",
      hero_check_1: "✓ Especificações de Frotas Comerciais",
      hero_check_2: "✓ Boletins de Expansão Aeroportuária",
      hero_check_3: "✓ Aviônica de Nova Geração e SAF",
      radar_title: "RADAR AEROESPACIAL",
      radar_sub: "Cobertura do Setor e Boletins de Frota",
      radar_btn: "Explorar",
      news_eyebrow: "Manchetes Urgentes",
      news_heading: "Notícias em Destaque da Aviação",
      news_view_all: "Ver Todas as Notícias →",
      slide1_badge: "Companhias Aéreas",
      slide1_title:
        "Anunciadas Atualizações de Frota Comercial de Nova Geração",
      slide1_desc:
        "Grandes companhias internacionais fazem pedidos bilionários de jatos wide-body eficientes para modernizar rotas de longo curso.",
      slide2_badge: "Aeroportos",
      slide2_title: "Terminais Biométricos Inteligentes Abrem pelo Mundo",
      slide2_desc:
        "Hubs internacionais integram filas de segurança com reconhecimento facial automatizado, reduzindo o tempo de check-in em até 40%.",
      slide3_badge: "Tecnologia",
      slide3_title:
        "Travessia Transatlântica com 100% SAF Concluída com Sucesso",
      slide3_desc:
        "Voo histórico completa travessia transatlântica movido integralmente por Combustível Sustentável de Aviação sem modificar os motores.",
      read_full_story: "Ler Matéria Completa",
      sectors_eyebrow: "Setores da Indústria",
      sectors_heading: "Explore a Aviação Comercial",
      sectors_subtitle:
        "Cobertura aprofundada nos principais setores da indústria.",
      card_airlines_title: "Companhias e Frotas",
      card_airlines_desc:
        "Análises detalhadas de entregas de wide-bodies, configurações de cabine e expansões de rotas.",
      card_airlines_btn: "Ver Companhias →",
      card_airports_title: "Aeroportos e Terminais",
      card_airports_desc:
        "Cobertura de construção de novas pistas, modernização de terminais e check-in biométrico.",
      card_airports_btn: "Ver Aeroportos →",
      card_airspace_title: "Espaço Aéreo e ATC",
      card_airspace_desc:
        "Informações sobre setores controlados, corredores oceânicos e rastreamento ADS-B via satélite.",
      card_airspace_btn: "Ver Espaço Aéreo →",
      card_tech_title: "Tecnologia Aeroespacial e SAF",
      card_tech_desc:
        "Atualizações sobre testes de combustível sustentável (SAF), propulsão a hidrogênio e aviônica.",
      card_tech_btn: "Ver Tecnologia →",
      vip_badge: "🎫 Sala VIP Primeira Classe",
      vip_title:
        "Desbloqueie Rastreadores de Frota, Wallpapers 4K e Relatórios Antecipados",
      vip_desc:
        "Crie uma conta gratuita na Aerolover ou faça upgrade para o Acesso Exclusivo para boletins internos e benefícios em salas VIP.",
      vip_btn_plans: "Comparar Planos",
      vip_btn_signup: "Criar Conta Grátis",
      footer_about:
        "Seu portal definitivo para notícias de aviação, atualizações de aeroportos, especificações de frotas e tecnologias aeroespaciais.",
      footer_nav_heading: "Navegação",
      footer_benefits_heading: "Benefícios",
      footer_exclusive: "Acesso Exclusivo",
      footer_connect_heading: "Contato",
      footer_location: "📍 Rede Mundial de Aviação",
      footer_copyright:
        "© 2026 Aerolover. Desenvolvido com Bootstrap 5 e Vanilla JS.",
      footer_privacy: "Política de Privacidade",
      footer_terms: "Termos de Serviço",
    },

    es: {
      label: "ES",
      page_title: "Aerolover - Análisis e Información de Aviación",
      menu_heading: "Menú",
      nav_home: "Inicio",
      nav_aviation: "Aviación",
      nav_airlines: "Aerolíneas",
      nav_airlines_icon: "✈️ Aerolíneas",
      nav_airports: "Aeropuertos",
      nav_airports_icon: "🛫 Aeropuertos",
      nav_airspace: "Espacio Aéreo",
      nav_airspace_icon: "📡 Espacio Aéreo",
      nav_news_tech: "Noticias y Tech",
      nav_latest_news: "Últimas Noticias",
      nav_latest_news_icon: "📰 Últimas Noticias",
      nav_sustainability: "Sostenibilidad",
      nav_sustainability_icon: "🌱 Sostenibilidad",
      nav_technology: "Tecnología",
      nav_technology_icon: "🛰️ Tecnología",
      nav_plans: "Planes",
      nav_contact: "Contacto",
      nav_account: "Cuenta",
      nav_signin: "Iniciar Sesión",
      nav_signup: "Registrarse",
      search_placeholder: "Buscar...",
      search_btn: "Ir",
      hero_badge_1: "✈️ Inteligencia Global de Aviación",
      hero_badge_2: "Flotas • Hubs • SAF",
      hero_title:
        "Tu Destino Principal para Análisis e Información de Aviación",
      hero_subtitle:
        "Sigue flotas globales, explora desarrollos aeroportuarios internacionales y mantente al día con las noticias aeroespaciales.",
      hero_cta_primary: "Comenzar Gratis",
      hero_cta_secondary: "Explorar Planes VIP",
      hero_check_1: "✓ Especificaciones de Flotas Comerciales",
      hero_check_2: "✓ Informes de Expansión Aeroportuaria",
      hero_check_3: "✓ Aviónica de Nueva Generación y SAF",
      radar_title: "RADAR AEROESPACIAL",
      radar_sub: "Cobertura en Vivo e Informes de Flota",
      radar_btn: "Explorar",
      news_eyebrow: "Titulares de Última Hora",
      news_heading: "Noticias Destacadas de Aviación",
      news_view_all: "Ver Todas las Noticias →",
      slide1_badge: "Aerolíneas",
      slide1_title:
        "Anunciadas Mejoras de Flota Comercial de Nueva Generación",
      slide1_desc:
        "Principales aerolíneas internacionales realizan pedidos multimillonarios de aviones de fuselaje ancho eficientes para rutas de largo radio.",
      slide2_badge: "Aeropuertos",
      slide2_title:
        "Terminales Biométricas Inteligentes Abren en Todo el Mundo",
      slide2_desc:
        "Los centros aeroportuarios integran filas de seguridad con reconocimiento facial automatizado, reduciendo los tiempos de facturación hasta un 40%.",
      slide3_badge: "Tecnología",
      slide3_title:
        "Cruce Transatlántico con 100% SAF Completado con Éxito",
      slide3_desc:
        "Un vuelo histórico completa una travesía transatlántica impulsado íntegramente por Combustible Sostenible de Aviación sin modificar motores.",
      read_full_story: "Leer Noticia Completa",
      sectors_eyebrow: "Sectores de la Industria",
      sectors_heading: "Explora la Aviación Comercial",
      sectors_subtitle:
        "Cobertura en profundidad en los sectores clave de la industria.",
      card_airlines_title: "Aerolíneas y Flotas",
      card_airlines_desc:
        "Desgloses detallados de entregas de fuselaje ancho, configuraciones de cabina y expansión de rutas.",
      card_airlines_btn: "Ver Aerolíneas →",
      card_airports_title: "Aeropuertos y Terminales",
      card_airports_desc:
        "Cobertura de construcción de nuevas pistas, modernización de terminales y facturación biométrica.",
      card_airports_btn: "Ver Aeropuertos →",
      card_airspace_title: "Espacio Aéreo y ATC",
      card_airspace_desc:
        "Información sobre sectores controlados, corredores oceánicos y seguimiento ADS-B por satélite.",
      card_airspace_btn: "Ver Espacio Aéreo →",
      card_tech_title: "Tecnología Aeroespacial y SAF",
      card_tech_desc:
        "Novedades sobre pruebas de combustible sostenible (SAF), propulsión de hidrógeno y aviónica.",
      card_tech_btn: "Ver Tecnología →",
      vip_badge: "🎫 Sala VIP Primera Clase",
      vip_title:
        "Desbloquea Rastreadores de Flota, Fondos 4K e Informes Anticipados",
      vip_desc:
        "Crea una cuenta gratuita en Aerolover o actualiza a Acceso Exclusivo para informes internos y ventajas en salas VIP.",
      vip_btn_plans: "Comparar Planes",
      vip_btn_signup: "Crear Cuenta Gratis",
      footer_about:
        "Tu portal definitivo para noticias de aviación, actualizaciones de aeropuertos, flotas y tecnologías aeroespaciales.",
      footer_nav_heading: "Navegación",
      footer_benefits_heading: "Beneficios",
      footer_exclusive: "Acceso Exclusivo",
      footer_connect_heading: "Conectar",
      footer_location: "📍 Red Mundial de Aviación",
      footer_copyright:
        "© 2026 Aerolover. Creado con Bootstrap 5 y Vanilla JS.",
      footer_privacy: "Política de Privacidad",
      footer_terms: "Términos de Servicio",
    },
    en: {
      label: "EN",
      page_title: "Aerolover - American Airlines",
      menu_heading: "Menu",
      nav_home: "Home",
      nav_aviation: "Aviation",
      nav_airlines: "Airlines",
      nav_airlines_icon: "✈️ Airlines",
      nav_airports: "Airports",
      nav_airports_icon: "🛫 Airports",
      nav_airspace: "Airspace",
      nav_airspace_icon: "📡 Airspace",
      nav_news_tech: "News & Tech",
      nav_latest_news: "Latest News",
      nav_latest_news_icon: "📰 Latest News",
      nav_sustainability: "Sustainability",
      nav_sustainability_icon: "🌱 Sustainability",
      nav_technology: "Technology",
      nav_technology_icon: "🛰️ Technology",
      nav_plans: "Plans",
      nav_contact: "Contact",
      nav_account: "Account",
      nav_signin: "Sign In",
      nav_signup: "Sign Up",
      search_placeholder: "Search...",
      search_btn: "Go",
      back_to_airlines: "Back to Airlines Directory",
      airlines_badge: "IATA: AA • ICAO: AAL • HQ: Fort Worth, Texas, USA • oneworld Founding Member",
      airlines_description:
        "The world's largest airline by fleet size and scheduled passengers carried, headquartered in Fort Worth, Texas. Operating an extensive hub-and-spoke network centered at Dallas/Fort Worth (DFW), Charlotte (CLT), and Miami (MIA), American connects North America with Latin America, Europe, and Asia-Pacific.",
      footer_about:
        "Your ultimate portal for aviation news, airport updates, airline fleet specs, and future aerospace technologies.",
      footer_nav_heading: "Navigation",
      footer_benefits_heading: "Benefits",
      footer_exclusive: "Exclusive Access",
      footer_connect_heading: "Connect",
      footer_location: "📍 Worldwide Aviation Network",
      footer_copyright:
        "© 2026 Aerolover. Built with Bootstrap 5 & Vanilla JS.",
      footer_privacy: "Privacy Policy",
      footer_terms: "Terms of Service",
    },

    pt: {
      label: "PT",
      page_title: "Aerolover - American Airlines",
      menu_heading: "Menu",
      nav_home: "Início",
      nav_aviation: "Aviação",
      nav_airlines: "Companhias Aéreas",
      nav_airlines_icon: "✈️ Companhias Aéreas",
      nav_airports: "Aeroportos",
      nav_airports_icon: "🛫 Aeroportos",
      nav_airspace: "Espaço Aéreo",
      nav_airspace_icon: "📡 Espaço Aéreo",
      nav_news_tech: "Notícias & Tecnologia",
      nav_latest_news: "Últimas Notícias",
      nav_latest_news_icon: "📰 Últimas Notícias",
      nav_sustainability: "Sustentabilidade",
      nav_sustainability_icon: "🌱 Sustentabilidade",
      nav_technology: "Tecnologia",
      nav_technology_icon: "🛰️ Tecnologia",
      nav_plans: "Planos",
      nav_contact: "Contato",
      nav_account: "Conta",
      nav_signin: "Entrar",
      nav_signup: "Cadastrar",
      search_placeholder: "Buscar...",
      search_btn: "Ir",
      back_to_airlines: "Voltar para o Diretório de Companhias Aéreas",
      airlines_badge: "IATA: AA • ICAO: AAL • HQ: Fort Worth, Texas, EUA • Membro Fundador da oneworld",
      airlines_description:
        "A maior companhia aérea do mundo pelo tamanho da frota e passageiros programados transportados, com sede em Fort Worth, Texas. Operando uma rede extensa de hub e spoke centrada em Dallas/Fort Worth (DFW), Charlotte (CLT) e Miami (MIA), a American conecta a América do Norte com a América Latina, Europa e o Pacífico Asiático.",
      footer_about:
        "Seu portal definitivo para notícias de aviação, atualizações de aeroportos, especificações de frota e tecnologias aeroespaciais futuras.",
      footer_nav_heading: "Navegação",
      footer_benefits_heading: "Benefícios",
      footer_exclusive: "Acesso Exclusivo",
      footer_connect_heading: "Conectar",
      footer_location: "📍 Rede Mundial de Aviação",
      footer_copyright:
        "© 2026 Aerolover. Criado com Bootstrap 5 e Vanilla JS.",
      footer_privacy: "Política de Privacidade",
      footer_terms: "Termos de Serviço",
    },
    es: {
      label: "ES",
      page_title: "Aerolover - Líneas Aéreas",
      menu_heading: "Menú",
      nav_home: "Inicio",
      nav_aviation: "Aviación",
      nav_airlines: "Líneas Aéreas",
      nav_airlines_icon: "✈️ Líneas Aéreas",
      nav_airports: "Aeropuertos",
      nav_airports_icon: "🛫 Aeropuertos",
      nav_airspace: "Espacio Aéreo",
      nav_airspace_icon: "📡 Espacio Aéreo",
      nav_news_tech: "Noticias & Tecnología",
      nav_latest_news: "Últimas Noticias",
      nav_latest_news_icon: "📰 Últimas Noticias",
      nav_sustainability: "Sostenibilidad",
      nav_sustainability_icon: "🌱 Sostenibilidad",
      nav_technology: "Tecnología",
      nav_technology_icon: "🛰️ Tecnología",
      nav_plans: "Planes",
      nav_contact: "Contacto",
      nav_account: "Cuenta",
      nav_signin: "Iniciar Sesión",
      nav_signup: "Registrarse",
      search_placeholder: "Buscar...",
      search_btn: "Ir",
      back_to_airlines: "Volver al Directorio de Líneas Aéreas",
      airlines_badge: "IATA: AA • ICAO: AAL • HQ: Fort Worth, Texas, EE. UU. • Miembro Fundador de oneworld",
      airlines_description:
        "La mayor compañía aérea del mundo por el tamaño de su flota y pasajeros programados transportados, con sede en Fort Worth, Texas. Operando una red extensa de hub y spoke centrada en Dallas/Fort Worth (DFW), Charlotte (CLT) y Miami (MIA), la American conecta América del Norte con América Latina, Europa y el Pacífico Asiático.",
      footer_about:
        "Su portal definitivo para noticias de aviación, actualizaciones de aeropuertos, especificaciones de flota y tecnologías aeroespaciales futuras.",
      footer_nav_heading: "Navegación",
      footer_benefits_heading: "Beneficios",
      footer_exclusive: "Acceso Exclusivo",
      footer_connect_heading: "Conectar",
      footer_location: "📍 Red Mundial de Aviación",
      footer_copyright:
        "© 2026 Aerolover. Creado con Bootstrap 5 y Vanilla JS.",
      footer_privacy: "Política de Privacidad",
      footer_terms: "Términos de Servicio",
    },
    en: {
      label: "EN",
      page_title: "Aerolover - Aeroméxico",
      menu_heading: "Menu",
      nav_home: "Home",
      nav_aviation: "Aviation",
      nav_airlines: "Airlines",
      nav_airlines_icon: "✈️ Airlines",
      nav_airports: "Airports",
      nav_airports_icon: "🛫 Airports",
      nav_airspace: "Airspace",
      nav_airspace_icon: "📡 Airspace",
      nav_news_tech: "News & Tech",
      nav_latest_news: "Latest News",
      nav_latest_news_icon: "📰 Latest News",
      nav_sustainability: "Sustainability",
      nav_sustainability_icon: "🌱 Sustainability",
      nav_technology: "Technology",
      nav_technology_icon: "🛰️ Technology",
      nav_plans: "Plans",
      nav_contact: "Contact",
      nav_account: "Account",
      nav_signin: "Sign In",
      nav_signup: "Sign Up",
      search_placeholder: "Search...",
      search_btn: "Go",
      back_to_airlines: "Back to Airlines Directory",
      airlines_badge: "IATA: AM • ICAO: AMX • HQ: Mexico City, Mexico • SkyTeam Founding Member",
      airlines_title: "Aeromexico",
      airlines_description: 
      "The flag carrier of Mexico and a founding member of the Skyteam alliance. Operating primarily from Mexico City International Airport (MEX), Aeroméxico connects domestic Mexican destinations with North America, Central and South America, Europe, and Asia via an all-Boeing and Embraer fleet.", 
       footer_about:
        "Your ultimate portal for aviation news, airport updates, airline fleet specs, and future aerospace technologies.",
      footer_nav_heading: "Navigation",
      footer_benefits_heading: "Benefits",
      footer_exclusive: "Exclusive Access",
      footer_connect_heading: "Connect",
      footer_location: "📍 Worldwide Aviation Network",
      footer_copyright:
        "© 2026 Aerolover. Built with Bootstrap 5 & Vanilla JS.",
      footer_privacy: "Privacy Policy",
      footer_terms: "Terms of Service",
  },
  pt: {
     label: "PT",
      page_title: "Aerolover - Aeromexico",
      menu_heading: "Menu",
      nav_home: "Início",
      nav_aviation: "Aviação",
      nav_airlines: "Companhias Aéreas",
      nav_airlines_icon: "✈️ Companhias Aéreas",
      nav_airports: "Aeroportos",
      nav_airports_icon: "🛫 Aeroportos",
      nav_airspace: "Espaço Aéreo",
      nav_airspace_icon: "📡 Espaço Aéreo",
      nav_news_tech: "Notícias & Tecnologia",
      nav_latest_news: "Últimas Notícias",
      nav_latest_news_icon: "📰 Últimas Notícias",
      nav_sustainability: "Sustentabilidade",
      nav_sustainability_icon: "🌱 Sustentabilidade",
      nav_technology: "Tecnologia",
      nav_technology_icon: "🛰️ Tecnologia",
      nav_plans: "Planos",
      nav_contact: "Contato",
      nav_account: "Conta",
      nav_signin: "Entrar",
      nav_signup: "Cadastrar",
      search_placeholder: "Buscar...",
      search_btn: "Ir",
      back_to_airlines: "Voltar para o Diretório de Companhias Aéreas",
      airlines_badge: "IATA: AM • ICAO: AMX • Sede: Cidade do México, México • Membro fundador da SkyTeam",
      airlines_description: "A companhia aérea de bandeira do México e membro fundador da aliança SkyTeam. Operando principalmente a partir do Aeroporto Internacional da Cidade do México (MEX), a Aeroméxico conecta destinos domésticos mexicanos à América do Norte, América Central e do Sul, Europa e Ásia, por meio de uma frota composta exclusivamente por aeronaves Boeing e Embraer.",
      airlines_overview: "Visão geral da frota ativa",
      airlines_descriptions2: "A Aeroméxico opera uma frota moderna de aeronaves Boeing 737 e 787 Dreamliner, complementada por jatos regionais Embraer E190 operados pela Aeroméxico Connect.",
      footer_about:
        "Seu portal definitivo para notícias de aviação, atualizações de aeroportos, especificações de frota e tecnologias aeroespaciais futuras.",
      footer_nav_heading: "Navegação",
      footer_benefits_heading: "Benefícios",
      footer_exclusive: "Acesso Exclusivo",
      footer_connect_heading: "Conectar",
      footer_location: "📍 Rede Mundial de Aviação",
      footer_copyright:
        "© 2026 Aerolover. Criado com Bootstrap 5 e Vanilla JS.",
      footer_privacy: "Política de Privacidade",
      footer_terms: "Termos de Serviço",
  }
};

  function applyLanguage(lang) {
    const dict = translations[lang] || translations.en;
    localStorage.setItem(STORAGE_LANG_KEY, lang);
    document.documentElement.lang = lang;

    if (
      dict.page_title &&
      (currentPath.endsWith("index.html") ||
        currentPath === "/" ||
        currentPath.endsWith("/"))
    ) {
      document.title = dict.page_title;
    }

    const currentLangLabel = document.getElementById("currentLangLabel");
    if (currentLangLabel) currentLangLabel.textContent = dict.label;

    const settingsLangSelect = document.getElementById("settingsLangSelect");
    if (settingsLangSelect) settingsLangSelect.value = lang;

    document.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key]) el.placeholder = dict[key];
    });
  }

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyLanguage(btn.getAttribute("data-lang"));
    });
  });

  const savedLang = localStorage.getItem(STORAGE_LANG_KEY) || "en";
  applyLanguage(savedLang);

  // ==========================================
  // HELPER UTILITIES
  // ==========================================
  function getRegisteredAccounts() {
    const data = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
    if (!data) return {};
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Error parsing registered accounts:", e);
      return {};
    }
  }

  function saveRegisteredAccounts(accounts) {
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
  }

  function showFieldError(inputElement, message) {
    if (!inputElement) return;
    inputElement.classList.add("is-invalid");
    let errorDiv =
      inputElement.parentElement.querySelector(".invalid-feedback");
    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.className = "invalid-feedback fw-semibold mt-1";
      inputElement.parentElement.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
  }

  function clearFieldError(inputElement) {
    if (!inputElement) return;
    inputElement.classList.remove("is-invalid");
    const errorDiv =
      inputElement.parentElement.querySelector(".invalid-feedback");
    if (errorDiv) {
      errorDiv.style.display = "none";
    }
  }

  function validatePasswordRules(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length < minLength) {
      return {
        isValid: false,
        message: "Password must be at least 8 characters long.",
      };
    }
    if (!hasUpperCase) {
      return {
        isValid: false,
        message: "Password must contain at least one uppercase letter.",
      };
    }
    if (!hasLowerCase) {
      return {
        isValid: false,
        message: "Password must contain at least one lowercase letter.",
      };
    }
    if (!hasNumber) {
      return {
        isValid: false,
        message: "Password must contain at least one number.",
      };
    }

    return { isValid: true, message: "Password is valid!" };
  }

  // ==========================================
  // INITIALIZE DEFAULT ACCOUNT (IF NONE EXISTS)
  // ==========================================
  function initializeDefaultAccount() {
    const existingAccounts = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
    if (!existingAccounts) {
      const defaultAccount = {
        "demo@aerolover.com": {
          firstName: "Demo",
          lastName: "User",
          password: "Password123",
          createdAt: new Date().toISOString(),
        },
      };
      saveRegisteredAccounts(defaultAccount);

      const defaultProfile = {
        firstName: "Demo",
        lastName: "User",
        email: "demo@aerolover.com",
        bio: "Aviation Enthusiast",
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(defaultProfile));
    }
  }

  initializeDefaultAccount();

  // ==========================================
  // ADMIN DIRECT PASSWORD RESET & OPTION B
  // ==========================================
  window.adminResetPassword = function (email, newPassword) {
    const activeEmail =
      sessionStorage.getItem("userEmail") || "demo@aerolover.com";
    const targetEmail = (email || activeEmail).trim().toLowerCase();
    const accounts = getRegisteredAccounts();

    if (!accounts[targetEmail]) {
      console.warn(`Account '${targetEmail}' does not exist.`);
      return false;
    }

    const passValidation = validatePasswordRules(newPassword);
    if (!passValidation.isValid) {
      console.error(`Password validation failed: ${passValidation.message}`);
      return false;
    }

    accounts[targetEmail].password = newPassword;
    saveRegisteredAccounts(accounts);

    console.log(
      `✅ Success! Password for '${targetEmail}' has been updated to '${newPassword}'.`,
    );
    return true;
  };

  const quickResetBtn = document.querySelector("#adminQuickResetBtn");
  if (quickResetBtn) {
    quickResetBtn.addEventListener("click", () => {
      const activeEmail =
        sessionStorage.getItem("userEmail") || "demo@aerolover.com";
      const success = window.adminResetPassword(activeEmail, "Password123");
      if (success) {
        alert(
          `Admin Override: Password for '${activeEmail}' directly reset to 'Password123'!`,
        );
      }
    });
  }

  // ==========================================
  // CROSS-TAB SIGN-OUT SYNCHRONIZATION
  // ==========================================
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_LOGOUT_EVENT_KEY) {
      sessionStorage.removeItem("isUnlocked");
      sessionStorage.removeItem("paymentCompleted");
      sessionStorage.removeItem("userEmail");

      if (
        !currentPath.endsWith("signin.html") &&
        !currentPath.endsWith("signup.html")
      ) {
        window.location.href = "signin.html";
      }
    }
  });

  // ==========================================
  // PERSISTENT "REMEMBER ME" AUTO-LOGIN CHECK
  // ==========================================
  const isRemembered = localStorage.getItem(STORAGE_REMEMBER_KEY) === "true";
  const rememberedEmail = localStorage.getItem(STORAGE_REMEMBER_EMAIL_KEY);

  if (isRemembered && rememberedEmail) {
    sessionStorage.setItem("isUnlocked", "true");
    sessionStorage.setItem("userEmail", rememberedEmail);
  }

  const isUnlocked = sessionStorage.getItem("isUnlocked") === "true";

  // ==========================================
  // 1. ROUTE GUARD
  // ==========================================
  const protectedPages = [
    "dashboard.html",
    "dashboard_settings.html",
    "dashboard_airlines.html",
    "dashboard_airports.html",
    "dashboard_latestnews.html",
    "dashboard_sustainability.html",
    "dashboard_technology.html",
    "dashboard_airspace.html",
    "dashboard_contact.html",
    "dashboard_plans.html",
    "dashboard_1.html",
    "dashboard_2.html",
    "dashboard_3.html",
    "dashboard2.html",
    "account.html",
    "checkout.html",
  ];

  const paymentRequiredPages = [
    "exclusive.html",
    "exclusive_settings.html",
    "exclusive_airlines.html",
    "exclusive_airports.html",
    "exclusive_latestnews.html",
    "exclusive_sustainability.html",
    "exclusive_technology.html",
    "exclusive_airspace.html",
    "exclusive_contact.html",
  ];

  const isProtected = protectedPages.some((page) => currentPath.endsWith(page));
  const isPaymentProtected = paymentRequiredPages.some((page) =>
    currentPath.endsWith(page),
  );

  // Redirect signed-out visitors to sign in
  if ((isProtected || isPaymentProtected) && !isUnlocked) {
    window.location.href = "signin.html";
    return;
  }

  const OWNER_EMAIL = "demo@aerolover.com";
  const currentUserEmail = sessionStorage.getItem("userEmail") || "";

  // Allow either the site owner OR any user who has completed payment
  if (isPaymentProtected) {
    const isOwner =
      currentUserEmail.toLowerCase() === OWNER_EMAIL.toLowerCase();
    if (isOwner) {
      localStorage.setItem("aerolover_payment_active", "true");
    }

    const hasActivePayment =
      localStorage.getItem("aerolover_payment_active") === "true";

    if (!isOwner && !hasActivePayment) {
      alert(
        "Access Denied: Please subscribe to a plan to enter the Exclusive Lounge.",
      );
      window.location.href = "plans.html";
      return;
    }
  }

  // ==========================================
  // DYNAMIC NAVBAR USER NAME & AVATAR DISPLAY
  // ==========================================
  function updateNavbarUserName() {
    const navUserName = document.querySelector("#navUserName");
    const navAvatarCircle = document.querySelector("#navAvatarCircle");
    if (!navUserName) return;

    const savedProfile = localStorage.getItem(STORAGE_PROFILE_KEY);
    if (savedProfile) {
      try {
        const data = JSON.parse(savedProfile);
        const first = data.firstName ? data.firstName.trim() : "";
        const last = data.lastName ? data.lastName.trim() : "";

        if (first) {
          const fullName = last ? `${first} ${last}` : first;
          navUserName.textContent = fullName;

          const initials = last
            ? `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
            : first.slice(0, 2).toUpperCase();

          if (navAvatarCircle) {
            navAvatarCircle.textContent = initials;
            navAvatarCircle.classList.remove("d-none");
          }
        }
      } catch (e) {
        console.error("Error parsing user profile for navbar:", e);
      }
    } else if (navAvatarCircle) {
      navAvatarCircle.classList.add("d-none");
    }
  }

  updateNavbarUserName();

  // ==========================================
  // 2. ALERT FEEDBACK UTILITY
  // ==========================================
  const alertBox = document.querySelector("#settingsAlert");
  const alertMsg = document.querySelector("#settingsAlertMsg");

  function showAlert(message, isSuccess = true) {
    if (alertBox && alertMsg) {
      alertMsg.textContent = message;
      alertBox.className = `alert ${
        isSuccess ? "alert-success" : "alert-danger"
      } alert-dismissible fade show`;
      alertBox.classList.remove("d-none");
    }
  }

  function performGlobalSignOut() {
    sessionStorage.removeItem("isUnlocked");
    sessionStorage.removeItem("paymentCompleted");
    sessionStorage.removeItem("userEmail");
    localStorage.removeItem(STORAGE_REMEMBER_KEY);
    localStorage.removeItem(STORAGE_REMEMBER_EMAIL_KEY);

    localStorage.setItem(STORAGE_LOGOUT_EVENT_KEY, Date.now().toString());

    window.location.href = "signin.html";
  }

  const logoutBtns = document.querySelectorAll("#logoutBtn, .logout-btn");
  logoutBtns.forEach((btn) => {
    btn.addEventListener("click", performGlobalSignOut);
  });

  // ==========================================
  // 3. ACCOUNT SETTINGS: LOCALSTORAGE INTEGRATION
  // ==========================================
  const profileForm = document.querySelector("#profileForm");
  const firstNameInput = document.querySelector("#firstName");
  const lastNameInput = document.querySelector("#lastName");
  const bioInput = document.querySelector("#bio");

  function loadProfileSettings() {
    const savedProfile = localStorage.getItem(STORAGE_PROFILE_KEY);
    if (savedProfile) {
      try {
        const data = JSON.parse(savedProfile);
        if (firstNameInput && data.firstName)
          firstNameInput.value = data.firstName;
        if (lastNameInput && data.lastName) lastNameInput.value = data.lastName;
        if (bioInput && data.bio) bioInput.value = data.bio;
      } catch (e) {
        console.error("Error reading profile from localStorage", e);
      }
    }
  }

  if (profileForm) {
    loadProfileSettings();

    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const firstVal = firstNameInput ? firstNameInput.value.trim() : "";
      const lastVal = lastNameInput ? lastNameInput.value.trim() : "";

      if (!firstVal || !lastVal) {
        showAlert("First name and last name are required.", false);
        return;
      }

      let existingEmail = sessionStorage.getItem("userEmail") || "";
      const savedProfile = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed.email) existingEmail = parsed.email;
        } catch (err) {
          console.error("Error parsing profile:", err);
        }
      }

      const profileData = {
        firstName: firstVal,
        lastName: lastVal,
        email: existingEmail,
        bio: bioInput ? bioInput.value.trim() : "",
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profileData));
      updateNavbarUserName();
      showAlert("Profile settings saved successfully!");
    });
  }

  // --- Payment Methods ---
  const paymentForm = document.querySelector("#paymentForm");
  const cardHolderInput = document.querySelector("#cardHolder");
  const cardNumberInput = document.querySelector("#cardNumber");
  const expDateInput = document.querySelector("#expDate");
  const cardDisplayTitle = document.querySelector("#cardDisplayTitle");
  const cardDisplaySubtitle = document.querySelector("#cardDisplaySubtitle");

  function loadSavedPayment() {
    const savedPayment = localStorage.getItem(STORAGE_PAYMENT_KEY);
    if (savedPayment && cardDisplayTitle && cardDisplaySubtitle) {
      try {
        const card = JSON.parse(savedPayment);
        const last4 = card.number.slice(-4) || "4242";
        cardDisplayTitle.textContent = `${card.brand || "Card"} ending in ${last4}`;
        cardDisplaySubtitle.textContent = `Expires ${card.expDate} • Default Payment`;
      } catch (e) {
        console.error("Error loading payment data", e);
      }
    }
  }

  if (paymentForm) {
    loadSavedPayment();

    paymentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const rawNumber = cardNumberInput
        ? cardNumberInput.value.replace(/\s+/g, "")
        : "";
      const paymentData = {
        holder: cardHolderInput ? cardHolderInput.value.trim() : "",
        number: rawNumber,
        expDate: expDateInput ? expDateInput.value.trim() : "",
        brand: rawNumber.startsWith("4")
          ? "Visa"
          : rawNumber.startsWith("5")
            ? "Mastercard"
            : "Card",
      };

      localStorage.setItem(STORAGE_PAYMENT_KEY, JSON.stringify(paymentData));
      loadSavedPayment();
      showAlert("New payment method saved!");
      paymentForm.reset();
    });
  }

  // --- Preferences ---
  const preferencesForm = document.querySelector("#preferencesForm");
  const prefNewsCheckbox = document.querySelector("#prefNews");
  const prefAlertsCheckbox = document.querySelector("#prefAlerts");
  const prefCategorySelect = document.querySelector("#prefCategory");

  function loadPreferences() {
    const savedPrefs = localStorage.getItem(STORAGE_PREFS_KEY);
    if (savedPrefs) {
      try {
        const prefs = JSON.parse(savedPrefs);
        if (prefNewsCheckbox) prefNewsCheckbox.checked = prefs.dailyDigest;
        if (prefAlertsCheckbox)
          prefAlertsCheckbox.checked = prefs.breakingAlerts;
        if (prefCategorySelect)
          prefCategorySelect.value = prefs.defaultCategory;
      } catch (e) {
        console.error("Error reading preferences", e);
      }
    }
  }

  if (preferencesForm) {
    loadPreferences();

    preferencesForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const prefsData = {
        dailyDigest: prefNewsCheckbox ? prefNewsCheckbox.checked : false,
        breakingAlerts: prefAlertsCheckbox ? prefAlertsCheckbox.checked : false,
        defaultCategory: prefCategorySelect ? prefCategorySelect.value : "all",
      };

      localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify(prefsData));
      showAlert("Site preferences saved!");
    });
  }

  // --- Passcode & Security ---
  const securityForm = document.querySelector("#securityForm");
  const currentPasscodeInput = document.querySelector("#currentPasscode");
  const newPasscodeInput = document.querySelector("#newPasscode");

  if (securityForm) {
    securityForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const currentVal = currentPasscodeInput
        ? currentPasscodeInput.value.trim()
        : "";
      const newVal = newPasscodeInput ? newPasscodeInput.value.trim() : "";

      if (currentVal !== SECRET_PASSCODE) {
        showAlert("Current passcode does not match!", false);
        return;
      }

      if (newVal.length < 4) {
        showAlert("New passcode must be at least 4 characters long.", false);
        return;
      }

      localStorage.setItem("aerolover_passcode", newVal);
      SECRET_PASSCODE = newVal;
      showAlert("Security passcode updated successfully!");
      securityForm.reset();
    });
  }

  // --- Permanent Account Deletion ---
  const deleteAccountBtn = document.querySelector("#deleteAccountBtn");
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener("click", () => {
      const activeUserEmail = sessionStorage.getItem("userEmail");

      const confirmFirst = confirm(
        "Are you sure you want to permanently delete your Aerolover account? This action cannot be undone.",
      );

      if (!confirmFirst) return;

      const confirmSecond = prompt(
        `To confirm deletion, please type your email address (${
          activeUserEmail || "your registered email"
        }):`,
      );

      if (
        confirmSecond &&
        confirmSecond.trim().toLowerCase() ===
          (activeUserEmail || "").toLowerCase()
      ) {
        const accounts = getRegisteredAccounts();
        if (activeUserEmail && accounts[activeUserEmail]) {
          delete accounts[activeUserEmail];
          saveRegisteredAccounts(accounts);
        }

        localStorage.removeItem(STORAGE_PROFILE_KEY);
        localStorage.removeItem(STORAGE_PREFS_KEY);
        localStorage.removeItem(STORAGE_PAYMENT_KEY);
        localStorage.removeItem(STORAGE_REMEMBER_KEY);
        localStorage.removeItem(STORAGE_REMEMBER_EMAIL_KEY);
        localStorage.removeItem("aerolover_payment_active");
        sessionStorage.removeItem("isUnlocked");
        sessionStorage.removeItem("userEmail");
        sessionStorage.removeItem("paymentCompleted");

        localStorage.setItem(STORAGE_LOGOUT_EVENT_KEY, Date.now().toString());

        alert("Your account has been permanently deleted.");
        window.location.href = "signup.html";
      } else if (confirmSecond !== null) {
        alert("Email verification failed. Account deletion canceled.");
      }
    });
  }

  // ==========================================
  // 4. AUTHENTICATION (SIGN UP & SIGN IN MEMORY)
  // ==========================================

  // Sign-Up Handler
  const freeSignupForm = document.querySelector("#freeSignupForm");
  if (freeSignupForm) {
    freeSignupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const firstNameInput = document.querySelector("#signupFirstName");
      const lastNameInput = document.querySelector("#signupLastName");
      const emailInput = document.querySelector("#signupEmail");
      const passwordInput = document.querySelector("#signupPassword");

      const firstName = firstNameInput ? firstNameInput.value.trim() : "";
      const lastName = lastNameInput ? lastNameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
      const password = passwordInput ? passwordInput.value.trim() : "";

      clearFieldError(emailInput);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFieldError(emailInput, "Please enter a valid email address.");
        return;
      }

      const passValidation = validatePasswordRules(password);
      if (!passValidation.isValid) {
        alert(passValidation.message);
        return;
      }

      const accounts = getRegisteredAccounts();

      if (accounts[email]) {
        showFieldError(
          emailInput,
          "An account with this email already exists. Please sign in.",
        );
        return;
      }

      accounts[email] = {
        firstName,
        lastName,
        password,
        createdAt: new Date().toISOString(),
      };

      saveRegisteredAccounts(accounts);

      const profileData = {
        firstName,
        lastName,
        email,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profileData));
      sessionStorage.setItem("userEmail", email);
      sessionStorage.setItem("isUnlocked", "true");

      updateNavbarUserName();
      alert("Account created successfully! Redirecting to dashboard...");
      window.location.href = "dashboard.html";
    });
  }

  // Sign-In Handler
  const freeSigninForm = document.querySelector("#freeSigninForm");
  if (freeSigninForm) {
    freeSigninForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const emailInput = document.querySelector("#signinEmail");
      const passwordInput = document.querySelector("#signinPassword");
      const rememberCheckbox = document.querySelector("#rememberMe");

      const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
      const password = passwordInput ? passwordInput.value.trim() : "";
      const shouldRemember = rememberCheckbox
        ? rememberCheckbox.checked
        : false;

      clearFieldError(emailInput);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFieldError(emailInput, "Please enter a valid email address.");
        return;
      }

      if (!password) {
        alert("Please enter your password.");
        return;
      }

      const accounts = getRegisteredAccounts();
      const userAccount = accounts[email];

      if (!userAccount) {
        showFieldError(
          emailInput,
          "No account found with this email address. Please sign up.",
        );
        return;
      }

      if (userAccount.password !== password) {
        alert("Incorrect password. Please try again.");
        return;
      }

      const profileData = {
        firstName: userAccount.firstName || email.split("@")[0],
        lastName: userAccount.lastName || "",
        email: email,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profileData));
      sessionStorage.setItem("userEmail", email);
      sessionStorage.setItem("isUnlocked", "true");

      if (shouldRemember) {
        localStorage.setItem(STORAGE_REMEMBER_KEY, "true");
        localStorage.setItem(STORAGE_REMEMBER_EMAIL_KEY, email);
      } else {
        localStorage.removeItem(STORAGE_REMEMBER_KEY);
        localStorage.removeItem(STORAGE_REMEMBER_EMAIL_KEY);
      }

      updateNavbarUserName();
      window.location.href = "dashboard.html";
    });
  }

  // ==========================================
  // DIRECT INBOX PROVIDER ROUTER & PASSWORD RESET
  // ==========================================
  function getInboxUrlForEmail(email) {
    const domain = email.split("@")[1] || "";
    switch (domain.toLowerCase()) {
      case "gmail.com":
      case "googlemail.com":
        return "https://mail.google.com";
      case "outlook.com":
      case "hotmail.com":
      case "live.com":
      case "msn.com":
        return "https://outlook.live.com";
      case "yahoo.com":
      case "ymail.com":
        return "https://mail.yahoo.com";
      case "icloud.com":
      case "me.com":
        return "https://www.icloud.com/mail";
      case "proton.me":
      case "protonmail.com":
        return "https://mail.proton.me";
      default:
        return `https://${domain}`;
    }
  }

  // Forgot Password Request Handler
  const forgotPasswordForm = document.querySelector("#forgotPasswordForm");
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const emailInput = document.querySelector("#forgotEmail");
      const sendResetBtn = document.querySelector("#sendResetBtn");
      const alertBox = document.querySelector("#forgotPasswordAlert");
      const email = emailInput ? emailInput.value.trim().toLowerCase() : "";

      clearFieldError(emailInput);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFieldError(emailInput, "Please enter a valid email address.");
        return;
      }

      const accounts = getRegisteredAccounts();
      if (!accounts[email]) {
        showFieldError(
          emailInput,
          "No registered account found with this email address.",
        );
        return;
      }

      if (sendResetBtn) {
        sendResetBtn.disabled = true;
        sendResetBtn.textContent = "Sending Request...";
      }

      const token =
        Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      const tokens = JSON.parse(
        localStorage.getItem(STORAGE_RESET_TOKENS_KEY) || "{}",
      );
      tokens[token] = { email, expires: Date.now() + 3600000 };
      localStorage.setItem(STORAGE_RESET_TOKENS_KEY, JSON.stringify(tokens));

      setTimeout(() => {
        const inboxUrl = getInboxUrlForEmail(email);

        if (alertBox) {
          alertBox.className = "alert alert-success mt-3 shadow-sm";
          alertBox.innerHTML = `
            <div class="d-flex align-items-center mb-2">
              <span class="fs-4 me-2">📩</span>
              <div>
                <strong>Reset Link Sent to ${email}!</strong>
              </div>
            </div>
            <p class="small text-muted mb-3">
              We have sent a password reset link to your email. Please open your inbox to access the link and set a new password.
            </p>
            <div class="d-grid gap-2">
              <a href="${inboxUrl}" target="_blank" class="btn btn-sm btn-success rounded-pill fw-bold">
                Open Email Inbox (${email.split("@")[1]}) ↗
              </a>
            </div>
          `;
          alertBox.classList.remove("d-none");
        }

        if (sendResetBtn) {
          sendResetBtn.disabled = false;
          sendResetBtn.textContent = "Resend Request";
        }
      }, 800);
    });
  }

  // Reset Password Execution Handler
  const resetPasswordForm = document.querySelector("#resetPasswordForm");
  if (resetPasswordForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const alertBox = document.querySelector("#resetPasswordAlert");

    const tokens = JSON.parse(
      localStorage.getItem(STORAGE_RESET_TOKENS_KEY) || "{}",
    );
    const tokenData = tokens[token];

    if (!token || !tokenData || Date.now() > tokenData.expires) {
      if (alertBox) {
        alertBox.className = "alert alert-danger";
        alertBox.textContent =
          "This password reset link is invalid or has expired. Please request a new one.";
        alertBox.classList.remove("d-none");
      }
      resetPasswordForm.style.display = "none";
    }

    resetPasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const newPassInput = document.querySelector("#newPassword");
      const confirmPassInput = document.querySelector("#confirmNewPassword");
      const saveBtn = document.querySelector("#saveNewPasswordBtn");

      const newPass = newPassInput ? newPassInput.value.trim() : "";
      const confirmPass = confirmPassInput ? confirmPassInput.value.trim() : "";

      clearFieldError(newPassInput);
      clearFieldError(confirmPassInput);

      const passValidation = validatePasswordRules(newPass);
      if (!passValidation.isValid) {
        showFieldError(newPassInput, passValidation.message);
        return;
      }

      if (newPass !== confirmPass) {
        showFieldError(confirmPassInput, "Passwords do not match.");
        return;
      }

      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = "Updating Password...";
      }

      setTimeout(() => {
        const accounts = getRegisteredAccounts();
        if (accounts[tokenData.email]) {
          accounts[tokenData.email].password = newPass;
          saveRegisteredAccounts(accounts);
        }

        delete tokens[token];
        localStorage.setItem(STORAGE_RESET_TOKENS_KEY, JSON.stringify(tokens));

        if (alertBox) {
          alertBox.className = "alert alert-success";
          alertBox.textContent =
            "Password updated successfully! Redirecting to sign in...";
          alertBox.classList.remove("d-none");
        }

        setTimeout(() => {
          window.location.href = "signin.html";
        }, 1500);
      }, 1000);
    });
  }

  // Checkout & Verification Flow
  const checkoutForm = document.querySelector("#checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = document.querySelector("#checkoutEmail");
      const email = emailInput ? emailInput.value.trim() : "";
      const payBtn = document.querySelector("#payButton");

      if (payBtn) {
        payBtn.disabled = true;
        payBtn.textContent = "Processing Payment...";
      }

      setTimeout(() => {
        sessionStorage.setItem("paymentCompleted", "true");
        sessionStorage.setItem("userEmail", email);
        window.location.href = "verify.html";
      }, 1500);
    });
  }

  if (currentPath.endsWith("verify.html")) {
    const isPaymentCompleted =
      sessionStorage.getItem("paymentCompleted") === "true";
    const verifyingState = document.querySelector("#verifyingState");
    const failedState = document.querySelector("#failedState");

    setTimeout(() => {
      if (isPaymentCompleted) {
        sessionStorage.setItem("isUnlocked", "true");
        localStorage.setItem("aerolover_payment_active", "true");
        sessionStorage.removeItem("paymentCompleted");
        window.location.href = "exclusive.html";
      } else {
        if (verifyingState) verifyingState.classList.add("d-none");
        if (failedState) failedState.classList.remove("d-none");
      }
    }, 2000);
  }

  // ==========================================
  // 5. INTERNAL SEARCH & ROUTING SYSTEM (EN / PT / ES)
  // ==========================================
  const searchForm = document.querySelector("#searchForm");
  const searchInput = document.querySelector("#searchInput");

  const searchRoutes = [
    {
      keywords: [
        "airline",
        "airlines",
        "fleet",
        "fleets",
        "aircraft",
        "carrier",
        "flights",
        "companhia",
        "companhias",
        "frota",
        "frotas",
        "aerolinea",
        "aerolineas",
        "flota",
        "flotas",
      ],
      target: "airlines.html",
    },
    {
      keywords: [
        "airport",
        "airports",
        "terminal",
        "terminals",
        "runway",
        "gate",
        "lounge",
        "aeroporto",
        "aeroportos",
        "aeropuerto",
        "aeropuertos",
        "pista",
      ],
      target: "airports.html",
    },
    {
      keywords: [
        "news",
        "headline",
        "headlines",
        "article",
        "breaking",
        "story",
        "updates",
        "noticia",
        "noticias",
        "ultimas",
        "manchetes",
        "titulares",
      ],
      target: "latestnews.html",
    },
    {
      keywords: [
        "sustainability",
        "sustainable",
        "green",
        "carbon",
        "eco",
        "emissions",
        "sustentabilidade",
        "sustentavel",
        "sostenibilidad",
        "sostenible",
        "verde",
      ],
      target: "sustainability.html",
    },
    {
      keywords: [
        "technology",
        "tech",
        "saf",
        "avionics",
        "fuel",
        "hydrogen",
        "innovation",
        "tecnologia",
        "combustivel",
        "hidrogenio",
        "hidrogeno",
        "avionica",
      ],
      target: "technology.html",
    },
    {
      keywords: [
        "airspace",
        "atc",
        "traffic management",
        "navigation",
        "sky",
        "altitude",
        "espaco aereo",
        "espacio aereo",
        "navegacao",
        "navegacion",
      ],
      target: "airspace.html",
    },
    {
      keywords: [
        "contact",
        "message",
        "support",
        "email",
        "reach",
        "help",
        "contato",
        "contacto",
        "suporte",
        "soporte",
        "ajuda",
        "ayuda",
      ],
      target: "contact.html",
    },
    {
      keywords: [
        "dashboard",
        "settings",
        "profile",
        "account",
        "painel",
        "configuracoes",
        "perfil",
        "conta",
        "cuenta",
      ],
      target: "dashboard.html",
    },
    {
      keywords: ["exclusive", "vip", "premium", "exclusivo"],
      target: "exclusive.html",
    },
    {
      keywords: [
        "plan",
        "plans",
        "pricing",
        "upgrade",
        "subscription",
        "plano",
        "planos",
        "planes",
        "assinatura",
        "suscripcion",
      ],
      target: "plans.html",
    },
    {
      keywords: [
        "signin",
        "sign in",
        "login",
        "log in",
        "entrar",
        "iniciar sesion",
      ],
      target: "signin.html",
    },
    {
      keywords: [
        "signup",
        "sign up",
        "register",
        "join",
        "criar conta",
        "cadastrar",
        "registrarse",
      ],
      target: "signup.html",
    },
  ];

  function normalizeSearchText(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const rawQuery = searchInput.value.trim();
      const normalizedQuery = normalizeSearchText(rawQuery);

      if (!normalizedQuery) return;

      const matchedRoute = searchRoutes.find((route) =>
        route.keywords.some((keyword) => normalizedQuery.includes(keyword)),
      );

      if (matchedRoute) {
        window.location.href = matchedRoute.target;
      } else {
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(rawQuery)}`;
      }
    });
  }
  // ==========================================
  // 6. CONTACT FORM HANDLER
  // ==========================================
  const contactForm = document.querySelector("#contactForm");
  const contactAlertBox = document.querySelector("#contactAlert");
  const contactAlertMsg = document.querySelector("#contactAlertMsg");
  const submitMsgBtn = document.querySelector("#submitMsgBtn");

  if (contactForm) {
    const contactEmailInput = document.querySelector("#contactEmail");

    if (contactEmailInput) {
      contactEmailInput.addEventListener("input", () => {
        clearFieldError(contactEmailInput);
      });
    }

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const emailValue = contactEmailInput
        ? contactEmailInput.value.trim()
        : "";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      clearFieldError(contactEmailInput);

      if (!emailValue || !emailRegex.test(emailValue)) {
        showFieldError(
          contactEmailInput,
          "Please enter a valid email address (e.g., user@domain.com).",
        );
        if (contactAlertBox) {
          contactAlertBox.classList.add("d-none");
        }
        return;
      }

      if (submitMsgBtn) {
        submitMsgBtn.disabled = true;
        submitMsgBtn.textContent = "Sending...";
      }

      setTimeout(() => {
        if (submitMsgBtn) {
          submitMsgBtn.disabled = false;
          submitMsgBtn.textContent = "Send Message ✈️";
        }

        if (contactAlertBox && contactAlertMsg) {
          contactAlertMsg.textContent =
            "Thank you! Your message has been sent directly to the Aerolover team.";
          contactAlertBox.className =
            "alert alert-success alert-dismissible fade show mb-4";
          contactAlertBox.classList.remove("d-none");
        }

        contactForm.reset();
      }, 1200);
    });
  }

  // ==========================================
  // 7. AIRLINES DIRECTORY FILTERING & PAGINATION
  // ==========================================
  const airlineSearchInput = document.getElementById("filterSearch");
  const airlineRegionSelect = document.getElementById("filterRegion");
  const allianceSelect = document.getElementById("filterAlliance");
  const typeCheckboxes = document.querySelectorAll(".filter-type");
  const resetBtn = document.getElementById("resetFiltersBtn");
  const airlineCards = Array.from(
    document.querySelectorAll(".airline-card-item"),
  );
  const airlineCountDisplay = document.getElementById("airlineCount");
  const airlineNoResults = document.getElementById("noResults");
  const loadMoreAirlinesBtn =
    document.getElementById("loadMoreAirlinesBtn") ||
    document.getElementById("loadMoreBtn");

  if (airlineCards.length > 0) {
    const AIRLINES_PER_PAGE = 6;
    let visibleAirlineLimit = AIRLINES_PER_PAGE;

    function updateAirlinesDisplay() {
      const searchTerm = airlineSearchInput
        ? airlineSearchInput.value.toLowerCase().trim()
        : "";
      const selectedRegion = airlineRegionSelect
        ? airlineRegionSelect.value
        : "all";
      const selectedAlliance = allianceSelect ? allianceSelect.value : "all";
      const selectedTypes = Array.from(typeCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);

      const matchingCards = airlineCards.filter((card) => {
        const name = card.dataset.name ? card.dataset.name.toLowerCase() : "";
        const region = card.dataset.region || "";
        const alliance = card.dataset.alliance || "";
        const type = card.dataset.type || "";

        const matchesSearch = !searchTerm || name.includes(searchTerm);
        const matchesRegion =
          selectedRegion === "all" || region === selectedRegion;
        const matchesAlliance =
          selectedAlliance === "all" || alliance === selectedAlliance;
        const matchesType =
          selectedTypes.length === 0 || selectedTypes.includes(type);

        return matchesSearch && matchesRegion && matchesAlliance && matchesType;
      });

      airlineCards.forEach((card) => card.classList.add("d-none"));

      const cardsToDisplay = matchingCards.slice(0, visibleAirlineLimit);
      cardsToDisplay.forEach((card) => card.classList.remove("d-none"));

      if (airlineCountDisplay) {
        airlineCountDisplay.textContent = `Showing ${cardsToDisplay.length} of ${matchingCards.length} airline${matchingCards.length === 1 ? "" : "s"}`;
      }

      if (airlineNoResults) {
        if (matchingCards.length === 0) {
          airlineNoResults.classList.remove("d-none");
        } else {
          airlineNoResults.classList.add("d-none");
        }
      }

      if (loadMoreAirlinesBtn) {
        if (
          visibleAirlineLimit >= matchingCards.length ||
          matchingCards.length === 0
        ) {
          loadMoreAirlinesBtn.classList.add("d-none");
        } else {
          loadMoreAirlinesBtn.classList.remove("d-none");
        }
      }
    }

    function handleAirlineFilterChange() {
      visibleAirlineLimit = AIRLINES_PER_PAGE;
      updateAirlinesDisplay();
    }

    if (loadMoreAirlinesBtn) {
      loadMoreAirlinesBtn.addEventListener("click", () => {
        visibleAirlineLimit += AIRLINES_PER_PAGE;
        updateAirlinesDisplay();
      });
    }

    if (airlineSearchInput)
      airlineSearchInput.addEventListener("input", handleAirlineFilterChange);
    if (airlineRegionSelect)
      airlineRegionSelect.addEventListener("change", handleAirlineFilterChange);
    if (allianceSelect)
      allianceSelect.addEventListener("change", handleAirlineFilterChange);
    typeCheckboxes.forEach((cb) =>
      cb.addEventListener("change", handleAirlineFilterChange),
    );

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (airlineSearchInput) airlineSearchInput.value = "";
        if (airlineRegionSelect) airlineRegionSelect.value = "all";
        if (allianceSelect) allianceSelect.value = "all";
        typeCheckboxes.forEach((cb) => (cb.checked = true));
        handleAirlineFilterChange();
      });
    }

    updateAirlinesDisplay();
  }

  // ==========================================
  // 8. AIRPORTS DIRECTORY FILTERING & PAGINATION
  // ==========================================
  const airportWrappers = Array.from(
    document.querySelectorAll(".airport-card-wrapper"),
  );
  const loadMoreAirportsBtn = document.getElementById("loadMoreAirportsBtn");
  const airportSearchInput = document.getElementById("airportFilterInput");
  const airportRegionSelect = document.getElementById("regionFilterSelect");
  const airportNoResults = document.getElementById("noResultsMsg");
  const airportCount = document.getElementById("airportCount");

  if (airportWrappers.length > 0) {
    const AIRPORTS_PER_LOAD = 3;
    let currentVisibleAirports = AIRPORTS_PER_LOAD;

    function updateAirportsDisplay() {
      const searchTerm = airportSearchInput
        ? airportSearchInput.value.toLowerCase().trim()
        : "";
      const selectedRegion = airportRegionSelect
        ? airportRegionSelect.value
        : "all";

      const matchingAirports = airportWrappers.filter((card) => {
        const title = card.getAttribute("data-title")?.toLowerCase() || "";
        const region = card.getAttribute("data-region") || "";

        const matchesSearch = !searchTerm || title.includes(searchTerm);
        const matchesRegion =
          selectedRegion === "all" || region === selectedRegion;

        return matchesSearch && matchesRegion;
      });

      airportWrappers.forEach((card) => card.classList.add("d-none"));

      const visibleBatch = matchingAirports.slice(0, currentVisibleAirports);
      visibleBatch.forEach((card) => card.classList.remove("d-none"));

      if (airportCount) {
        airportCount.textContent = `Showing ${visibleBatch.length} of ${matchingAirports.length} airport${matchingAirports.length === 1 ? "" : "s"}`;
      }

      if (airportNoResults) {
        if (matchingAirports.length === 0) {
          airportNoResults.classList.remove("d-none");
        } else {
          airportNoResults.classList.add("d-none");
        }
      }

      if (loadMoreAirportsBtn) {
        if (
          currentVisibleAirports >= matchingAirports.length ||
          matchingAirports.length === 0
        ) {
          loadMoreAirportsBtn.parentElement.classList.add("d-none");
        } else {
          loadMoreAirportsBtn.parentElement.classList.remove("d-none");
        }
      }
    }

    if (loadMoreAirportsBtn) {
      loadMoreAirportsBtn.addEventListener("click", () => {
        currentVisibleAirports += AIRPORTS_PER_LOAD;
        updateAirportsDisplay();
      });
    }

    if (airportSearchInput) {
      airportSearchInput.addEventListener("input", () => {
        currentVisibleAirports = AIRPORTS_PER_LOAD;
        updateAirportsDisplay();
      });
    }

    if (airportRegionSelect) {
      airportRegionSelect.addEventListener("change", () => {
        currentVisibleAirports = AIRPORTS_PER_LOAD;
        updateAirportsDisplay();
      });
    }

    updateAirportsDisplay();
  }

  // Airport Details Modal Population
  const airportModal = document.getElementById("airportDetailModal");
  if (airportModal) {
    airportModal.addEventListener("show.bs.modal", (event) => {
      const button = event.relatedTarget;
      document.getElementById("airportModalTitle").textContent =
        button.getAttribute("data-airport-name");
      document.getElementById("airportModalCode").textContent =
        button.getAttribute("data-airport-code");
      document.getElementById("airportModalRegion").textContent =
        button.getAttribute("data-airport-region");
      document.getElementById("airportModalDesc").textContent =
        button.getAttribute("data-airport-desc");
    });
  }

  // ==========================================
  // 9. TIMELINE FILTER LOGIC
  // ==========================================
  const filterBtns = document.querySelectorAll("#timelineFilterGroup button");
  const newsItems = document.querySelectorAll(".news-item-wrapper");
  const noNewsAlert = document.querySelector("#noNewsAlert");

  if (filterBtns.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => {
          b.classList.remove("btn-primary", "active");
          b.classList.add("btn-outline-primary");
        });

        btn.classList.remove("btn-outline-primary");
        btn.classList.add("btn-primary", "active");

        const selectedTimeline = btn.getAttribute("data-timeline");
        let visibleCount = 0;

        newsItems.forEach((item) => {
          const itemTimeline = item.getAttribute("data-timeline");

          if (selectedTimeline === "all" || itemTimeline === selectedTimeline) {
            item.classList.remove("d-none");
            visibleCount++;
          } else {
            item.classList.add("d-none");
          }
        });

        if (noNewsAlert) {
          if (visibleCount === 0) {
            noNewsAlert.classList.remove("d-none");
          } else {
            noNewsAlert.classList.add("d-none");
          }
        }
      });
    });
  }

  // ==========================================
  // 10. TECHNOLOGY FILTER & MODAL
  // ==========================================
  const filterInput = document.getElementById("techFilterInput");
  const categoryPills = document.querySelectorAll(".category-pill");
  const cards = document.querySelectorAll(".tech-card-wrapper");
  const noResults = document.getElementById("noTechResults");
  const resetTechBtn = document.getElementById("resetTechFiltersBtn");
  let activeCategory = "all";

  if (filterInput && cards.length > 0) {
    function filterCards() {
      const query = filterInput.value.trim().toLowerCase();
      let visibleCount = 0;

      cards.forEach((card) => {
        const title = (card.dataset.title || "").toLowerCase();
        const text = card.textContent.toLowerCase();
        const category = card.dataset.category;

        const matchesCategory =
          activeCategory === "all" || category === activeCategory;
        const matchesQuery =
          !query || title.includes(query) || text.includes(query);

        if (matchesCategory && matchesQuery) {
          card.classList.remove("d-none");
          card.classList.add("d-flex");
          visibleCount++;
        } else {
          card.classList.add("d-none");
          card.classList.remove("d-flex");
        }
      });

      if (noResults) {
        noResults.classList.toggle("d-none", visibleCount > 0);
      }
    }

    categoryPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        categoryPills.forEach((btn) => {
          btn.classList.remove("btn-primary", "active");
          btn.classList.add("btn-outline-secondary");
        });
        pill.classList.remove("btn-outline-secondary");
        pill.classList.add("btn-primary", "active");
        activeCategory = pill.dataset.category;
        filterCards();
      });
    });

    filterInput.addEventListener("input", filterCards);

    if (resetTechBtn) {
      resetTechBtn.addEventListener("click", () => {
        filterInput.value = "";
        if (categoryPills[0]) categoryPills[0].click();
      });
    }
  }

  const techModal = document.getElementById("techDetailModal");
  if (techModal) {
    techModal.addEventListener("show.bs.modal", (event) => {
      const button = event.relatedTarget;
      document.getElementById("techModalTitle").textContent =
        button.getAttribute("data-tech-title");
      document.getElementById("techModalCategory").textContent =
        button.getAttribute("data-tech-category");
      document.getElementById("techModalSpec").textContent =
        button.getAttribute("data-tech-spec");
      document.getElementById("techModalDesc").textContent =
        button.getAttribute("data-tech-desc");
    });
  }

  // ==========================================
  // 11. EXCLUSIVE LOUNGE GREETING & PERK MODAL
  // ==========================================
  const greetingEl = document.getElementById("loungeMemberGreeting");
  if (greetingEl) {
    const savedProfile = localStorage.getItem(STORAGE_PROFILE_KEY);
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.firstName) {
          greetingEl.textContent = profile.firstName.trim();
        }
      } catch (e) {
        console.error("Error parsing profile for greeting:", e);
      }
    }
  }

  const perkModal = document.getElementById("perkPreviewModal");
  if (perkModal) {
    perkModal.addEventListener("show.bs.modal", (event) => {
      const button = event.relatedTarget;
      document.getElementById("perkModalTitle").textContent =
        button.getAttribute("data-perk-title");
      document.getElementById("perkModalBody").textContent =
        button.getAttribute("data-perk-body");
    });
  }
});