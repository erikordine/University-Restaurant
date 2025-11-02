import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator,
    ScrollView, Platform, Alert, Dimensions,
} from 'react-native';
import {
    // --- Navegação Principal e Home ---
    Home, LayoutDashboard, Utensils, CircleDollarSign, Settings,
    Wallet, CalendarDays, TrendingUp, BarChart3, PieChart,

    // --- Formulário, Ação e Utilidade ---
    User, Lock, Mail, ArrowLeft, Bell, Shield, HelpCircle,
    CreditCard, QrCode, ChevronRight, Filter, Plus, Minus, X,

    // --- Ícones Diversos ---
    Star, Calendar, Save, Users, Ban,
    Send, DollarSign,
} from 'lucide-react-native';

// =================================================================
// ╔═════════════════════════════════════════════════════════════╗
// ║ 1. CONSTANTES E DADOS INICIAIS                              ║
// ╚═════════════════════════════════════════════════════════════╝

// --- Constantes ---
const SCHEDULE_COST = 10.00;
const USERS_STORAGE_KEY = 'ruAppUsers';
const MENU_STORAGE_KEY = 'ruAppMenuItems';
const SESSION_STORAGE_KEY = 'ruAppSessionUserId';
const PIX_KEY_SIMULADA = '00.111.222/0001-33 - RU Digital';

// --- Dados Iniciais (Fallback se localStorage estiver vazio) ---
const INITIAL_USER_DATA = [
    {
        id: 1,
        nome: "João Silva",
        email: "joao.silva@email.com",
        password: "123",
        matricula: "2023001234",
        curso: "Engenharia de Software",
        saldo: 45.50,
        refeicoesMes: 12,
        agendamentos: 3,
        avaliacaoMedia: 4.5,
        refeicoesTotal: 156,
        economizado: 1200,
        isAdmin: false,
        refeicoesAvaliadas: [
            { id: 1, rating: 5 },
            { id: 2, rating: 4 }
        ],
        notifications: [],
    },
    {
        id: 2,
        nome: "Admin Gestor",
        email: "admin@email.com",
        password: "admin",
        matricula: "0000000000",
        curso: "Administração",
        saldo: 999.00,
        refeicoesMes: 0,
        agendamentos: 0,
        avaliacaoMedia: 0.0,
        refeicoesTotal: 0,
        economizado: 0,
        isAdmin: true,
        refeicoesAvaliadas: [],
        notifications: [],
    }
];

const INITIAL_MENU_ITEMS_DATA = [
    { id: 1, dia: "Segunda-feira", prato: "Arroz, Feijão, Frango grelhado, Salada verde", kcal: 520, tipo: "Tradicional", cor: "blue", avaliacaoTotal: 20, numVotos: 5, avaliacaoMedia: 4.0 },
    { id: 2, dia: "Terça-feira", prato: "Arroz integral, Feijão, Lasanha de berinjela, Suco natural", kcal: 480, tipo: "Vegetariano", cor: "green", avaliacaoTotal: 18, numVotos: 4, avaliacaoMedia: 4.5 },
    { id: 3, dia: "Quarta-feira", prato: "Arroz, Feijão preto, Carne de panela, Farofa", kcal: 580, tipo: "Tradicional", cor: "blue", avaliacaoTotal: 0, numVotos: 0, avaliacaoMedia: 0.0 },
    { id: 4, dia: "Quinta-feira", prato: "Arroz integral, Grão-de-bico ao curry, Legumes refogados", kcal: 450, tipo: "Vegano", cor: "teal", avaliacaoTotal: 5, numVotos: 1, avaliacaoMedia: 5.0 },
    { id: 5, dia: "Sexta-feira", prato: "Arroz, Feijão, Peixe assado, Purê de batata", kcal: 490, tipo: "Tradicional", cor: "blue", avaliacaoTotal: 9, numVotos: 3, avaliacaoMedia: 3.0 },
];

// =================================================================
// ╔═════════════════════════════════════════════════════════════╗
// ║ 2. COMPONENTES AUXILIARES (UI Blocks)                       ║
// ╚═════════════════════════════════════════════════════════════╝

// --- Componente de Loading ---
function LoadingScreen() {
    return (
        <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#2563eb" />
        </View>
    );
}

// --- Componente Logo RU (Usando Lucide) ---
function LogoRU() {
    return (
        <View style={styles.ruLogoContainer}>
            <Utensils size={64} color="#2563eb" />
            <Text style={styles.ruLogoText}>RU</Text>
        </View>
    );
}

function PageHeader({ title, onBack }) {
    const isHomeScreen = title === 'Home' || title === 'Admin Dashboard';
    if (isHomeScreen) {
        return null;
    }

    return (
        <View style={styles.pageHeader}>
            {onBack && (
                <TouchableOpacity onPress={onBack} style={styles.pageHeaderBackButton}>
                    <ArrowLeft size={24} color="#374151" />
                </TouchableOpacity>
            )}
            <Text style={styles.pageHeaderTitle}>{title}</Text>
        </View>
    );
}

// Localize a função InputComIcon (linha 476 no seu último código)
function InputComIcon({ icon, placeholder, type = "default", value, onChange }) {
    // Determina o tipo de teclado (keyboardType)
    const keyboardType = type === 'number' ? 'numeric' : 'default';
    // CORREÇÃO APLICADA: 'none' para email ou password, 'sentences' para outros
    const autoCapitalize = type === 'email' || type === 'password' ? 'none' : 'sentences';
    const secureTextEntry = type === 'password';

    return (
        <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
                {React.cloneElement(icon, { color: '#9ca3af', size: 20 })}
            </View>
            <TextInput
                style={styles.inputField}
                placeholder={placeholder}
                value={value}
                onChangeText={onChange}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize} // <-- Corrigido aqui
                placeholderTextColor="#9ca3af"
            />
        </View>
    );
}

function MetricCard({ icon, label, value }) {
    return (
        <View style={styles.metricCard}>
            <View style={styles.metricCardIconWrapper}>
                {React.cloneElement(icon, { size: 20 })}
            </View>
            <Text style={styles.metricCardLabel}>{label}</Text>
            <Text style={styles.metricCardValue}>{value}</Text>
        </View>
    );
}

function ActionCard({ icon, title, subtitle, onClick }) {
    return (
        <TouchableOpacity onPress={onClick} style={styles.actionCard}>
            <View style={styles.actionCardIconWrapper}>
                {React.cloneElement(icon, { size: 24 })}
            </View>
            <View style={{ flexShrink: 1 }}>
                <Text style={styles.actionCardTitle}>{title}</Text>
                <Text style={styles.actionCardSubtitle}>{subtitle}</Text>
            </View>
        </TouchableOpacity>
    );
}

// --- MODIFICADO: MenuItemCard ---
// Adicionada a prop 'isAdmin'
function MenuItemCard({ item, onRate, userHasRated, isAdmin = false }) {
    const colorStyles = {
        blue: { card: styles.menuColorBlue, tag: styles.menuTagBlue },
        green: { card: styles.menuColorGreen, tag: styles.menuTagGreen },
        teal: { card: styles.menuColorTeal, tag: styles.menuTagTeal }
    };
    const classes = colorStyles[item?.cor] || {};
    const mediaFormatada = item.avaliacaoMedia ? item.avaliacaoMedia.toFixed(1) : '—';
    const votacaoInfo = item.numVotos ? `(${item.numVotos} votos)` : '(Sem votos)';

    return (
        <View style={[styles.menuItemCard, classes.card]}>
            <View style={styles.menuItemHeader}>
                <Text style={styles.menuItemDay}>{item?.dia || '...'}</Text>
                <Text style={styles.menuItemKcal}>{item?.kcal || 0} kcal</Text>
            </View>
            <Text style={styles.menuItemDetails}>{item?.prato || 'Carregando...'}</Text>
           
            <View style={styles.menuItemFooter}>
                 <Text style={[styles.menuItemTag, classes.tag]}>{item?.tipo || '...'}</Text>
                 <View style={styles.menuItemRating}>
                     <Star size={16} color="#eab308" fill="#eab308" />
                     <Text style={styles.menuItemRatingText}> {mediaFormatada} {votacaoInfo}</Text>
                 </View>
            </View>

            {/* --- MODIFICAÇÃO: Botão só aparece se NÃO for admin --- */}
            {!isAdmin && (
                <TouchableOpacity
                    onPress={() => onRate(item)}
                    style={[styles.rateButton, userHasRated && styles.rateButtonDisabled]}
                    disabled={userHasRated}
                >
                    <Text style={styles.rateButtonText}>
                        {userHasRated ? 'Avaliado' : 'Avaliar Refeição'}
                    </Text>
                </TouchableOpacity>
            )}
            {/* --- FIM DA MODIFICAÇÃO --- */}
        </View>
    );
}
// --- FIM DA MODIFICAÇÃO ---

// --- MODIFICADO: BottomNavBar ---
function BottomNavBar({ activeTab, setActiveTab, userIsAdmin }) {
    // --- 1. Adicionada a aba "Editar" para Admin ---
    const navItems = userIsAdmin ? [
        { name: 'Dashboard', icon: <LayoutDashboard /> },
        { name: 'Editar', icon: <Utensils /> }, // <--- ADICIONADO
        { name: 'Financeiro', icon: <CircleDollarSign /> },
        { name: 'Config', icon: <Settings /> }
    ] : [
        { name: 'Início', icon: <Home /> },
        { name: 'Cardápio', icon: <Utensils /> },
        { name: 'Financeiro', icon: <CircleDollarSign /> },
        { name: 'Config', icon: <Settings /> }
    ];
// --- FIM DA MODIFICAÇÃO ---

    return (
        <View style={styles.bottomNav}>
            {navItems.map((item) => (
                <TouchableOpacity
                    key={item.name}
                    onPress={() => setActiveTab(item.name)}
                    style={[styles.navItem, activeTab === item.name && styles.navItemActive]}
                >
                    <View style={styles.navItemIconWrapper}>
                        {React.cloneElement(item.icon, { size: 24, color: activeTab === item.name ? '#2563eb' : '#9ca3af' })}
                    </View>
                    <Text style={[styles.navItemLabel, activeTab === item.name && styles.navItemLabelActive]}>
                        {item.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

function Modal({ message, onClose }) {
    return (
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalMessage}>{message}</Text>
                <TouchableOpacity onPress={onClose} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;
    return (
        <View style={styles.confirmModalOverlay}>
            <View style={styles.confirmModalContent}>
                <Text style={styles.confirmModalTitle}>{title}</Text>
                <Text style={styles.confirmModalMessage}>{message}</Text>
                <View style={styles.confirmModalButtons}>
                    <TouchableOpacity onPress={onClose} style={[styles.confirmModalButton, styles.confirmButtonCancel]}>
                        <Text style={styles.confirmButtonCancelText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onConfirm} style={[styles.confirmModalButton, styles.confirmButtonConfirm]}>
                        <Text style={styles.confirmButtonConfirmText}>Confirmar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

// --- NOVO COMPONENTE: MODAL DE AVALIAÇÃO ---
function RatingModal({ isOpen, onClose, onRate, item }) {
    const [rating, setRating] = useState(0);

    // Reinicia o rating para 0 toda vez que o modal abre
    useEffect(() => {
        if (isOpen) {
            setRating(0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleRating = (star) => {
        setRating(star);
    };

    const handleSubmit = () => {
        if (rating > 0) {
            onRate(item.id, rating); // Chama handleRateMeal
            onClose(); // Chama setRatingModal({ isOpen: false ... })
        } else {
             Alert.alert("Erro", "Selecione pelo menos uma estrela.");
        }
    };

    return (
        <View style={styles.modalOverlay}>
            <View style={styles.ratingModalContent}>
                <Text style={styles.ratingModalTitle}>Avalie o Prato:</Text>
                <Text style={styles.ratingModalSubtitle}>{item.prato}</Text>
                <View style={styles.starContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity key={star} onPress={() => handleRating(star)}>
                            <Star
                                size={40}
                                color="#eab308"
                                fill={star <= rating ? '#eab308' : 'none'}
                                style={styles.starIcon}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity onPress={handleSubmit} style={[styles.modalButton, { marginTop: 20 }]}>
                    <Text style={styles.modalButtonText}>Enviar Avaliação ({rating} Estrelas)</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


// =================================================================
// ╔═════════════════════════════════════════════════════════════╗
// ║ 3. TELAS (SCREENS)                                          ║
// ╚═════════════════════════════════════════════════════════════╝

function LoginScreen({ navigate, onLogin, showModal }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = () => {
        if (!email || !password) { showModal("Preencha todos os campos"); return; }
        onLogin(email, password);
    };

    return (
        <View style={styles.fullScreenContainer}>
            <ScrollView contentContainerStyle={styles.loginScreenContent}>
                <LogoRU />
                <Text style={styles.loginTitle}>RU Digital</Text>
                <Text style={styles.loginSubtitle}>Acesse sua conta para agendamentos e saldo.</Text>
                <View style={styles.loginFormGroup}>
                    <InputComIcon icon={<Mail />} placeholder="E-mail Institucional" type="email" value={email} onChange={setEmail} />
                    <InputComIcon icon={<Lock />} placeholder="Senha" type="password" value={password} onChange={setPassword} />
                </View>
                <TouchableOpacity onPress={handleSubmit} style={styles.mainButton}>
                    <Text style={styles.mainButtonText}>Entrar</Text>
                </TouchableOpacity>
                <View style={styles.loginLinkContainer}>
                    <Text style={styles.loginLinkText}>
                        Primeiro acesso?
                        <Text style={styles.loginLink} onPress={() => navigate('SIGNUP')}> Registe-se</Text>
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

function SignupScreen({ navigate, onSignup, showModal }) {
    const [nome, setNome] = useState(''); const [email, setEmail] = useState(''); const [ra, setRa] = useState(''); const [password, setPassword] = useState(''); const [terms, setTerms] = useState(false);
    const handleSubmit = () => { if (!nome || !email || !ra || !password) { showModal("Preencha todos os campos"); return; } if (!terms) { showModal("Deve aceitar os Termos"); return; } onSignup(nome, email, ra, password); };
    return (
        <View style={styles.fullScreenContainer}>
            <ScrollView style={styles.signupScreen}>
                <TouchableOpacity onPress={() => navigate('LOGIN')} style={styles.signupBackButton}>
                    <ArrowLeft size={24} color="#374151" />
                </TouchableOpacity>
                <View style={styles.signupIntroContainer}>
                   <LogoRU />
                   <Text style={styles.signupTitle}>Criar Conta RU</Text>
                   <Text style={styles.signupSubtitle}>Use seu e-mail institucional e RA.</Text>
                </View>
                <View style={styles.signupFormGroup}>
                    <InputComIcon icon={<User />} placeholder="Nome Completo" value={nome} onChange={setNome} />
                    <InputComIcon icon={<Mail />} placeholder="E-mail Institucional" value={email} onChange={setEmail} />
                    <InputComIcon icon={<User />} placeholder="RA (Matrícula)" type="text" value={ra} onChange={setRa} />
                    <InputComIcon icon={<Lock />} placeholder="Senha" type="password" value={password} onChange={setPassword} />
                </View>
                <View style={styles.termsContainer}>
                    <TouchableOpacity
                        onPress={() => setTerms(!terms)}
                        style={[styles.termsCheckbox, terms ? styles.termsCheckboxChecked : {}]}
                    >
                        {terms && <X size={14} color="white" />}
                    </TouchableOpacity>
                    <Text style={styles.termsLabel}>
                        Concordo com os
                        <Text style={styles.termsLink} onPress={() => Alert.alert("Termos de Uso", "Conteúdo simulado.")}> Termos de Uso</Text>
                    </Text>
                </View>
                <TouchableOpacity onPress={handleSubmit} style={styles.mainButton}>
                    <Text style={styles.mainButtonText}>Registar</Text>
                </TouchableOpacity>
                <View style={styles.signupLinkContainer}>
                    <Text style={styles.loginLinkText}>
                        Já tem conta?
                        <Text style={styles.loginLink} onPress={() => navigate('LOGIN')}> Entrar</Text>
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

// --- MODIFICADO: HomeScreen ---
function HomeScreen({ navigate, user, pratoDoDia }) { // <--- 1. Recebe pratoDoDia
    if (!user) return <LoadingScreen />;
   
    // AGORA ESTE VALOR É DINÂMICO!
    const userRating = user.avaliacaoMedia ? user.avaliacaoMedia.toFixed(1) : '—';

    // --- 2. Lógica de cálculo REMOVIDA ---
    // (useState e useEffect para pratoDoDia foram removidos)

    return (
        <View style={styles.homeScreen}>
            <ScrollView contentContainerStyle={styles.screenContentScroll}>
                {/* Header Azul cobrindo Status Bar (paddingTop: 20/60) */}
                <View style={styles.homeHeader}>
                    <View style={styles.homeHeaderContent}>
                        <View style={styles.homeHeaderBalance}>
                            <View>
                                <Text style={styles.balanceTextSm}>Saldo disponível</Text>
                                <Text style={styles.balanceTextLg}>R$ {user.saldo?.toFixed(2).replace('.', ',') || '0,00'}</Text>
                            </View>
                            <View style={styles.balanceIconWrapper}>
                                <Wallet size={24} color="white" />
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => navigate('PAYMENTS')} style={styles.homeRechargeButton}>
                            <Text style={styles.homeRechargeButtonText}>Recarregar saldo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.homeMetricsGrid}>
                    <MetricCard icon={<Utensils color="#16a34a" />} label="Refeições (mês)" value={user.refeicoesMes || 0} />
                    <MetricCard icon={<CalendarDays color="#2563eb" />} label="Agendados" value={user.agendamentos || 0} />
                    <MetricCard icon={<Star color="#eab308" />} label="Sua avaliação" value={userRating} />
                </View>
                <View style={styles.homeActionsContainer}>
                    <Text style={styles.homeSectionTitle}>Ações rápidas</Text>
                    <View style={styles.homeActionsGrid}>
                        <ActionCard icon={<Utensils color="#16a34a" />} title="Ver cardápio" subtitle="Pratos da semana" onClick={() => navigate('MENU')} />
                        <ActionCard icon={<Calendar color="#2563eb" />} title="Agendar" subtitle="Próxima refeição" onClick={() => navigate('SCHEDULE')} />
                    </View>
                </View>

                {/* --- 3. Bloco "Ocupação" substituído por "Prato do Dia" --- */}
                <View style={styles.homeActionsContainer}>
                    <Text style={styles.homeSectionTitle}>Prato do Dia</Text>
                    {pratoDoDia ? ( // <--- 3. Usa a prop
                        <MenuItemCard
                            item={pratoDoDia}
                            onRate={() => navigate('MENU')}
                            userHasRated={user.refeicoesAvaliadas?.some(r => r.id === pratoDoDia.id)}
                            isAdmin={user.isAdmin}
                        />
                    ) : (
                        <View style={styles.homeChartCard}>
                            <Text style={styles.menuListEmpty}>Carregando cardápio...</Text>
                        </View>
                    )}
                </View>
                {/* --- Fim da Modificação --- */}

            </ScrollView>
        </View>
    );
}
// --- Fim da Modificação ---


// *** TELA: CARDÁPIO (MENU) ***
function MenuScreen({ navigate, menuItems, user, onRateMeal }) {
    const [ratingModal, setRatingModal] = useState({ isOpen: false, item: null });

    if (!user) return <LoadingScreen/>;
   
    // --- MODIFICADO: Checagem com .some() ---
    const hasRated = (itemId) => user.refeicoesAvaliadas?.some(r => r.id === itemId);

    return (
        <View style={styles.menuScreen}>
            {ratingModal.isOpen && (
                <RatingModal
                    isOpen={ratingModal.isOpen}
                    onClose={() => setRatingModal({ isOpen: false, item: null })}
                    onRate={onRateMeal}
                    item={ratingModal.item}
                />
            )}

            <PageHeader title="Cardápio da Semana" onBack={() => navigate(user.isAdmin ? 'ADMIN_DASHBOARD' : 'HOME')} />
            <ScrollView contentContainerStyle={styles.screenContentScroll}>
                <View style={styles.menuList}>
                    {menuItems.length > 0 ? (
                        menuItems.map((item) => (
                            <MenuItemCard
                                key={item.id}
                                item={item}
                                userHasRated={hasRated(item.id)}
                                onRate={() => setRatingModal({ isOpen: true, item: item })}
                                isAdmin={user.isAdmin} // <--- Passa prop de admin
                            />
                        ))
                    ) : (
                        <Text style={styles.menuListEmpty}>Carregando cardápio...</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

function ScheduleScreen({ navigate, showModal, user, onScheduleSuccess }) {
    const [selectedMeal, setSelectedMeal] = useState(null); const [dayOffset, setDayOffset] = useState(0); const [showConfirmModal, setShowConfirmModal] = useState(false);
    if (!user) return <LoadingScreen />;
    const getDate = (offset) => { const date = new Date(); date.setDate(date.getDate() + offset); return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }); }; const getWeekday = (offset) => { const date = new Date(); date.setDate(date.getDate() + offset); const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' }); return weekday.charAt(0).toUpperCase() + weekday.slice(1); };
    const handleSchedule = () => { if (!selectedMeal) { showModal("Selecione refeição."); return; } if (user.saldo < SCHEDULE_COST) { showModal("Saldo insuficiente."); return; } setShowConfirmModal(true); };
   
    // --- MODIFICADO ---
    const confirmAndPay = () => {
        // Cria a mensagem para a notificação
        const diaAgendado = `${getWeekday(dayOffset)}, ${getDate(dayOffset)}`;
        const refeicaoAgendada = selectedMeal === 'almoco' ? 'Almoço' : 'Jantar';
        const message = `Agendado: ${refeicaoAgendada} em ${diaAgendado}`;
       
        // Envia o custo E a mensagem para o handler
        onScheduleSuccess(SCHEDULE_COST, message);
       
        setShowConfirmModal(false);
        showModal(`Agendado! Custo: R$ ${SCHEDULE_COST.toFixed(2).replace('.',',')}`);
        setTimeout(() => navigate('HOME'), 1500);
    };
    // --- FIM DA MODIFICAÇÃO ---

    return (
        <View style={styles.scheduleScreen}>
            <ConfirmationModal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} onConfirm={confirmAndPay} title="Confirmar Agendamento" message={`Custo: R$ ${SCHEDULE_COST.toFixed(2).replace('.',',')}. Continuar?`} />
            <PageHeader title="Agendamento" onBack={() => navigate('HOME')} />
            <ScrollView contentContainerStyle={styles.scheduleContent}>
                <View style={styles.scheduleSection}>
                    <Text style={styles.scheduleSectionTitle}>Dia:</Text>
                    <View style={styles.scheduleDayGrid}>
                        <TouchableOpacity style={[styles.scheduleButton, dayOffset === 0 && styles.scheduleButtonSelected]} onPress={() => setDayOffset(0)}><Text>Hoje</Text><Text>{getWeekday(0)}, {getDate(0)}</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.scheduleButton, dayOffset === 1 && styles.scheduleButtonSelected]} onPress={() => setDayOffset(1)}><Text>Amanhã</Text><Text>{getWeekday(1)}, {getDate(1)}</Text></TouchableOpacity>
                    </View>
                    <Text style={styles.scheduleSectionTitle}>Refeição:</Text>
                    <View style={styles.scheduleMealOptions}>
                        <TouchableOpacity style={[styles.scheduleButton, selectedMeal === 'almoco' && styles.scheduleButtonSelected]} onPress={() => setSelectedMeal('almoco')}><Text style={styles.scheduleButtonTitle}>Almoço (11:00-14:00)</Text><Text style={styles.scheduleButtonSubtitle}>(Ver cardápio)</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.scheduleButton, selectedMeal === 'jantar' && styles.scheduleButtonSelected]} onPress={() => setSelectedMeal('jantar')}><Text style={styles.scheduleButtonTitle}>Jantar (17:00-19:00)</Text><Text style={styles.scheduleButtonSubtitle}>(Ver cardápio)</Text></TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={handleSchedule} style={styles.mainButton}><Text style={styles.mainButtonText}>Confirmar Agendamento (R$ {SCHEDULE_COST.toFixed(2).replace('.',',')})</Text></TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

// *** TELA: RECARGA PIX (RECHARGE PIX SCREEN) ***
function RechargePixScreen({ navigate, showModal, onRecharge }) {
    const [amount, setAmount] = useState('');
   
    const handleConfirm = () => {
        const parsedAmount = parseFloat(amount.replace(',', '.'));
        if (isNaN(parsedAmount) || parsedAmount <= 0) { showModal("Valor inválido."); return; }
        onRecharge(parsedAmount);
    };

    const handleCopyPix = () => {
        // Simulação de cópia da chave PIX
        Alert.alert("Sucesso!", `Chave PIX copiada:\n${PIX_KEY_SIMULADA}`);
    };

    return (
        <View style={styles.rechargeScreen}>
            <PageHeader title="Recarregar PIX" onBack={() => navigate('PAYMENTS')} />
            <ScrollView contentContainerStyle={styles.rechargeContent}>
                <View style={styles.rechargeQrContainer}>
                    <QrCode size={128} color="#2563eb" />
                </View>
                <Text style={styles.rechargeInstructions}>Escaneie o QR Code acima e insira o valor da recarga.</Text>
               
                {/* Chave PIX e Botão Copiar */}
                <View style={styles.pixKeyContainer}>
                    <Text style={styles.pixKeyLabel}>Chave Copia e Cola:</Text>
                    <Text style={styles.pixKeyValue}>{PIX_KEY_SIMULADA}</Text>
                    <TouchableOpacity onPress={handleCopyPix} style={styles.copyPixButton}>
                        <Text style={styles.copyPixButtonText}>COPIAR CHAVE PIX</Text>
                    </TouchableOpacity>
                </View>
               
                <View style={styles.rechargeInputContainer}>
                    <InputComIcon icon={<CircleDollarSign />} placeholder="Valor (ex: 50,00)" type="numeric" value={amount} onChange={setAmount} />
                </View>
                <TouchableOpacity onPress={handleConfirm} style={styles.mainButton}>
                    <Text style={styles.mainButtonText}>Confirmar Recarga</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

function PaymentsScreen({ navigate, user }) {
    if (!user) return <LoadingScreen />;
    return (
        <View style={styles.paymentsScreen}>
            <PageHeader title="Financeiro" onBack={() => navigate(user.isAdmin ? 'ADMIN_DASHBOARD' : 'HOME')} />
            <ScrollView contentContainerStyle={styles.paymentsContent}>
                <View style={styles.paymentsBalanceCard}>
                    <Text style={styles.paymentsBalanceLabel}>Saldo Atual</Text>
                    <Text style={styles.paymentsBalanceValue}>R$ {user.saldo?.toFixed(2).replace('.', ',') || '0,00'}</Text>
                    <View style={styles.paymentsRechargeCard}>
                        <Text style={styles.paymentsRechargeTitle}>Recarregar</Text>
                        <View style={styles.paymentsOptionsList}>
                            <TouchableOpacity style={styles.paymentOptionButton}>
                                <CreditCard color="#2563eb" />
                                <Text style={styles.paymentOptionLabel}>Cartão (Indisponível)</Text>
                                <ChevronRight size={20} color="#9ca3af" style={styles.paymentOptionIconRight} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.paymentOptionButton} onPress={() => navigate('RECHARGE_PIX')}>
                                <QrCode color="#16a34a" />
                                <Text style={styles.paymentOptionLabel}>PIX</Text>
                                <ChevronRight size={20} color="#9ca3af" style={styles.paymentOptionIconRight} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

// --- TELA DE DADOS PESSOAIS (MODIFICADA) ---
function PersonalDataScreen({ navigate, user }) {
    // --- Lógica de senha removida ---

    return (
        <View style={styles.profileScreen}>
            <PageHeader title="Dados Pessoais" onBack={() => navigate('PROFILE')} />
            <ScrollView contentContainerStyle={styles.profileDataContent}>
               
                {/* Informações de Visualização */}
                <View style={styles.dataCard}>
                    <Text style={styles.dataLabel}>Nome Completo</Text>
                    <Text style={styles.dataValue}>{user.nome}</Text>
                </View>
                <View style={styles.dataCard}>
                    <Text style={styles.dataLabel}>E-mail Institucional</Text>
                    <Text style={styles.dataValue}>{user.email}</Text>
                </View>
                <View style={styles.dataCard}>
                    <Text style={styles.dataLabel}>RA / Matrícula</Text>
                    <Text style={styles.dataValue}>{user.matricula}</Text>
                </View>
                <View style={styles.dataCard}>
                    <Text style={styles.dataLabel}>Curso</Text>
                    <Text style={styles.dataValue}>{user.curso}</Text>
                </View>

                {/* --- Seção de senha removida --- */}
            </ScrollView>
        </View>
    );
}
// --- FIM DA MODIFICAÇÃO ---

// --- TELA DE SEGURANÇA (NOVA) ---
function SecurityScreen({ navigate, onChangePassword, showModal }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showEdit, setShowEdit] = useState(false);

    const handleSavePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            return showModal("Preencha todos os campos de senha.");
        }
        if (newPassword !== confirmPassword) {
            return showModal("As novas senhas não coincidem.");
        }
        if (newPassword.length < 3) {
            return showModal("A nova senha deve ter pelo menos 3 caracteres.");
        }
       
        onChangePassword(currentPassword, newPassword);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowEdit(false);
    };

    return (
        <View style={styles.profileScreen}>
            <PageHeader title="Segurança" onBack={() => navigate('PROFILE')} />
            <ScrollView contentContainerStyle={styles.profileDataContent}>
               
                {/* Seção de Troca de Senha (MOVIDA PARA CÁ) */}
                <View style={styles.passwordCard}>
                    <Text style={styles.passwordTitle}>Segurança e Senha</Text>
                   
                    {!showEdit ? (
                        <TouchableOpacity onPress={() => setShowEdit(true)} style={styles.passwordButton}>
                            <Text style={styles.passwordButtonText}>Alterar Senha</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.passwordEditContainer}>
                            <InputComIcon icon={<Lock />} placeholder="Senha Atual" type="password" value={currentPassword} onChange={setCurrentPassword} />
                            <InputComIcon icon={<Lock />} placeholder="Nova Senha" type="password" value={newPassword} onChange={setNewPassword} />
                            <InputComIcon icon={<Lock />} placeholder="Confirmar Nova Senha" type="password" value={confirmPassword} onChange={setConfirmPassword} />
                           
                            <TouchableOpacity onPress={handleSavePassword} style={[styles.mainButton, styles.mainButtonSmall]}>
                                <Text style={styles.mainButtonText}>Salvar Nova Senha</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowEdit(false)} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
// --- FIM DA TELA NOVA ---


// --- TELA DE NOTIFICAÇÕES (NOVA) ---
function NotificationsScreen({ navigate, user, onCancelSchedule }) {
    if (!user) return <LoadingScreen />;

    // Ordena as notificações, mais novas primeiro
    const sortedNotifications = user.notifications ? [...user.notifications].reverse() : [];

    const getIconForType = (type) => {
        if (type === 'agendamento') return <CalendarDays color="#2563eb" />;
        if (type === 'aviso') return <Bell color="#eab308" />;
        if (type === 'credito') return <DollarSign color="#16a34a" />;
        return <Bell color="#6b7280" />;
    };

    return (
        <View style={styles.profileScreen}>
            <PageHeader title="Notificações" onBack={() => navigate('PROFILE')} />
            <ScrollView contentContainerStyle={styles.notificationsContent}>
                {sortedNotifications.length === 0 ? (
                    <Text style={styles.notificationsEmpty}>Nenhuma notificação ainda.</Text>
                ) : (
                    sortedNotifications.map(notif => (
                        <View key={notif.id} style={styles.notificationCard}>
                            <View style={styles.notificationIcon}>
                                {getIconForType(notif.type)}
                            </View>
                            <View style={styles.notificationBody}>
                                <Text style={[styles.notificationMessage, notif.status === 'cancelado' && styles.notificationMessageCanceled]}>
                                    {notif.message}
                                </Text>
                                <Text style={styles.notificationDate}>
                                    {new Date(notif.id).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                            <View style={styles.notificationAction}>
                                {notif.type === 'agendamento' && notif.status === 'ativo' && (
                                    <TouchableOpacity
                                        style={styles.cancelScheduleButton}
                                        onPress={() => onCancelSchedule(notif.id)}
                                    >
                                        <Ban size={16} color="#dc2626" />
                                        <Text style={styles.cancelScheduleButtonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                )}
                                {notif.type === 'agendamento' && notif.status === 'cancelado' && (
                                    <Text style={styles.canceledText}>Cancelado</Text>
                                )}
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

function ProfileScreen({ navigate, user, onLogout }) {
    if (!user) return <LoadingScreen />;
    const profileItems = [
        { icon: <User color="#2563eb" />, label: "Dados Pessoais", screen: 'PERSONAL_DATA' },
        { icon: <Shield color="#16a34a" />, label: "Segurança", screen: 'SECURITY' },
        { icon: <Bell color="#eab308" />, label: "Notificações", screen: 'NOTIFICATIONS' },
        { icon: <HelpCircle color="#6b7280" />, label: "Ajuda", screen: 'HELP' },
    ];
    return (
        <View style={styles.profileScreen}>
            <PageHeader title="Configurações" onBack={() => navigate(user.isAdmin ? 'ADMIN_DASHBOARD' : 'HOME')} />
            <ScrollView contentContainerStyle={styles.screenContentScroll}>
                <View style={styles.profileUserInfo}>
                    <View style={styles.profileAvatar}>
                        <User size={48} color={user.isAdmin ? '#9333ea' : '#2563eb'} />
                    </View>
                    <Text style={styles.profileName}>{user.nome || 'Usuário'} {user.isAdmin ? '(Admin)' : ''}</Text>
                    <Text style={styles.profileEmail}>{user.email || '...'}</Text>
                    <Text style={styles.profileMatricula}>Matrícula: {user.matricula || '...'}</Text>
                </View>
                <View style={styles.profileMenu}>
                    {profileItems.map(item => (
                        <TouchableOpacity
                            key={item.label}
                            style={styles.profileMenuItem}
                            onPress={() => navigate(item.screen || 'PROFILE')}
                        >
                            <View style={styles.profileMenuItemLeft}>
                                <View style={styles.profileMenuIconWrapper}>{item.icon}</View>
                                <Text style={styles.profileMenuLabel}>{item.label}</Text>
                            </View>
                            <ChevronRight size={20} color="#9ca3af" />
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.profileLogoutContainer}>
                    <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
                        <Text style={styles.logoutButtonText}>Sair</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

// --- MODIFICADO: AdminDashboardScreen ---
function AdminDashboardScreen({ navigate, menuItems, pratoDoDia }) { 
    const stats = [
        { icon: <Users color="#2563eb" />, label: "Ativos", value: "1.2k" },
        { icon: <Utensils color="#16a34a" />, label: "Refeições Hoje", value: "850" },
        { icon: <CircleDollarSign color="#9333ea" />, label: "Receita (Dia)", value: "R$ 4.2k" },
    ];
    
    return (
        <View style={styles.adminScreen}>
            {/* PageHeader lida com o paddingTop necessário */}
            <PageHeader title="Admin Dashboard" onBack={() => navigate('PROFILE')} />
            <ScrollView contentContainerStyle={styles.adminContent}>
                <View>
                    <Text style={styles.adminSectionTitle}>Estatísticas (Hoje)</Text>
                    <View style={styles.adminStatsGrid}>
                        {stats.map(stat => (
                            <View key={stat.label} style={styles.adminStatCard}>
                                <View style={styles.adminStatIconWrapper}>{stat.icon}</View>
                                <Text style={styles.adminStatLabel}>{stat.label}</Text>
                                <Text style={styles.adminStatValue}>{stat.value}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                
                {/* Ações Administrativas */}
                <View style={styles.adminActionsCard}>
                    <Text style={styles.adminActionsTitle}>Ações</Text>
                    <View style={styles.adminActionsList}>
                        <TouchableOpacity style={[styles.adminActionButton, styles.adminButtonYellow]} onPress={() => navigate('ADMIN_USER_MANAGEMENT')}><Users size={16} color="#ca8a04" /><Text style={{ color:       '#ca8a04', fontWeight: '600' }}> Gestão de Usuários</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.adminActionButton, styles.adminButtonGreen]} onPress={() => navigate('ADMIN_ANNOUNCE')}><Send size={16} color="#16a34a" /><Text style={{ color: '#16a34a', fontWeight: '600' }}> Enviar Anúncio</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.adminActionButton, styles.adminButtonBlue]} onPress={() => navigate('ADMIN_RATINGS_REPORT')}><BarChart3 size={16} color="#1d4ed8" /><Text style={{ color: '#1d4ed8', fontWeight: '600' }}> Relatório de Avaliações</Text></TouchableOpacity>
                    </View>
                </View>

                {/* Bloco do Prato do Dia */}
                <View>
                    <Text style={styles.adminSectionTitle}>Prato do Dia</Text>
                    {pratoDoDia ? ( 
                        <MenuItemCard
                            item={pratoDoDia}
                            onRate={() => {}} 
                            userHasRated={true} 
                            isAdmin={true}
                        />
                    ) : (
                        <View style={styles.adminChartCard}>
                            <Text style={styles.menuListEmpty}>Carregando cardápio...</Text>
                        </View>
                    )}
                </View>
                
            </ScrollView>
        </View>
    );
}
// --- FIM DA MODIFICAÇÃO ---

function AdminEditMenuScreen({ navigate, currentMenu, onSave }) {
    const [editedMenu, setEditedMenu] = useState(() => Array.isArray(currentMenu) ? [...currentMenu.map(item => ({...item}))] : []);
    useEffect(() => { if (Array.isArray(currentMenu)) { setEditedMenu([...currentMenu.map(item => ({...item}))]); } }, [currentMenu]);

    const handleChange = (id, field, value) => {
        setEditedMenu(prevMenu => prevMenu.map(item => item.id === id ? { ...item, [field]: value } : item ));
    };

    const handleTypeChange = (id, newType) => {
        let newColor = 'blue';
        if (newType === 'Vegetariano') newColor = 'green';
        if (newType === 'Vegano') newColor = 'teal';
        setEditedMenu(prevMenu => prevMenu.map(item => item.id === id ? { ...item, tipo: newType, cor: newColor } : item ));
    };

    const handleSave = () => {
        const isValid = editedMenu.every(item => item.prato && item.kcal > 0 && item.tipo);
        if (!isValid) { Alert.alert("Erro", "Preencha corretamente todos os campos."); return; }
        onSave(editedMenu);
    };

    return (
        <View style={styles.adminEditMenuScreen}>
            <PageHeader title="Editar Cardápio" onBack={() => navigate('ADMIN_DASHBOARD')} />
            <ScrollView contentContainerStyle={styles.adminEditMenuContent}>
                {editedMenu.length > 0 ? editedMenu.map(item => (
                    <View key={item.id} style={styles.editMenuItemCard}>
                        <Text style={styles.editMenuItemDay}>{item.dia}</Text>
                        <View style={styles.editMenuFormGroup}>
                            <View><Text style={styles.editMenuLabel}>Prato</Text><TextInput style={styles.editMenuInput} value={item.prato} onChangeText={(text) => handleChange(item.id, 'prato', text)} /></View>
                            <View><Text style={styles.editMenuLabel}>Kcal</Text><TextInput style={styles.editMenuInput} keyboardType="numeric" value={String(item.kcal)} onChangeText={(text) => handleChange(item.id, 'kcal', parseInt(text) || 0)} /></View>
                            <View><Text style={styles.editMenuLabel}>Tipo</Text><TextInput style={styles.editMenuInput} value={item.tipo} onChangeText={(text) => handleTypeChange(item.id, text)} /></View>
                        </View>
                    </View>
                )) : <Text style={styles.menuListEmpty}>Carregando...</Text>}
            </ScrollView>
            <View style={styles.saveButtonContainer}>
                <TouchableOpacity onPress={handleSave} style={styles.mainButton} disabled={editedMenu.length === 0}>
                    <Save size={20} color="white" />
                    <Text style={styles.mainButtonText}> Salvar Cardápio</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// --- TELA DE GESTÃO DE USUÁRIOS (NOVA) ---
function AdminUserManagementScreen({ navigate, users, onManualCredit, showModal }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [amount, setAmount] = useState('');

    const filteredUsers = users.filter(user =>
        !user.isAdmin && (
            user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const openModal = (user) => {
        setSelectedUser(user);
        setAmount('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleConfirmCredit = () => {
        const parsedAmount = parseFloat(amount.replace(',', '.'));
        if (isNaN(parsedAmount)) {
            return showModal("Valor inválido. Use 10 ou -10.");
        }
        onManualCredit(selectedUser.id, parsedAmount);
        closeModal();
    };

    return (
        <View style={styles.profileScreen}>
            {isModalOpen && selectedUser && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.ratingModalTitle}>Ajustar Saldo</Text>
                        <Text style={styles.ratingModalSubtitle}>{selectedUser.nome}</Text>
                        <InputComIcon
                            icon={<DollarSign />}
                            placeholder="Valor (ex: 10.00 ou -5.00)"
                            type="numeric"
                            value={amount}
                            onChange={setAmount}
                        />
                        <View style={[styles.confirmModalButtons, { marginTop: 24 }]}>
                            <TouchableOpacity onPress={closeModal} style={[styles.confirmModalButton, styles.confirmButtonCancel]}>
                                <Text style={styles.confirmButtonCancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleConfirmCredit} style={[styles.confirmModalButton, styles.confirmButtonConfirm]}>
                                <Text style={styles.confirmButtonConfirmText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            <PageHeader title="Gestão de Usuários" onBack={() => navigate('ADMIN_DASHBOARD')} />
            <View style={styles.userSearchContainer}>
                <InputComIcon
                    icon={<User />}
                    placeholder="Buscar por nome ou e-mail..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                />
            </View>
            <ScrollView contentContainerStyle={styles.userListContent}>
                {filteredUsers.length === 0 ? (
                    <Text style={styles.notificationsEmpty}>Nenhum usuário encontrado.</Text>
                ) : (
                    filteredUsers.map(user => (
                        <View key={user.id} style={styles.userCard}>
                            <View style={styles.notificationBody}>
                                <Text style={styles.notificationMessage}>{user.nome}</Text>
                                <Text style={styles.notificationDate}>{user.email}</Text>
                                <Text style={styles.userBalance}>Saldo: R$ {user.saldo.toFixed(2)}</Text>
                            </View>
                            <TouchableOpacity style={styles.creditButton} onPress={() => openModal(user)}>
                                <DollarSign size={16} color="#1d4ed8" />
                                <Text style={styles.creditButtonText}>Ajustar</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

// --- TELA DE ANÚNCIOS (NOVA) ---
function AdminAnnounceScreen({ navigate, onSendAnnouncement, showModal }) {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.length < 5) {
            return showModal("Mensagem muito curta.");
        }
        onSendAnnouncement(message);
        setMessage('');
    };

    return (
        <View style={styles.profileScreen}>
            <PageHeader title="Enviar Anúncio Global" onBack={() => navigate('ADMIN_DASHBOARD')} />
            <ScrollView contentContainerStyle={styles.profileDataContent}>
                <View style={styles.dataCard}>
                    <Text style={styles.dataLabel}>Mensagem do Anúncio</Text>
                    <TextInput
                        style={styles.announceInput}
                        placeholder="Ex: O RU fechará mais cedo hoje..."
                        value={message}
                        onChangeText={setMessage}
                        multiline={true}
                        numberOfLines={5}
                    />
                    <TouchableOpacity onPress={handleSend} style={[styles.mainButton, { marginTop: 24 }]}>
                        <Send size={20} color="white" />
                        <Text style={styles.mainButtonText}> Enviar para todos</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

// --- TELA DE RELATÓRIO DE AVALIAÇÕES (NOVA) ---
function AdminRatingsReportScreen({ navigate, menuItems }) {
    const [top5, setTop5] = useState([]);
    const [worst5, setWorst5] = useState([]);

    useEffect(() => {
        if (menuItems && menuItems.length > 0) {
            const allRatedItems = menuItems.filter(item => item.numVotos > 0);
           
            const topRated = [...allRatedItems]
                .sort((a, b) => b.avaliacaoMedia - a.avaliacaoMedia)
                .slice(0, 5);
               
            const worstRated = [...allRatedItems]
                .sort((a, b) => a.avaliacaoMedia - b.avaliacaoMedia)
                .slice(0, 5);

            setTop5(topRated);
            setWorst5(worstRated);
        }
    }, [menuItems]);

    const renderRatingCard = (item, index, color = "#16a34a") => (
        <View key={item.id} style={styles.reportCard}>
            <Text style={styles.reportRank}>{index + 1}.</Text>
            <View style={styles.reportBody}>
                <Text style={styles.reportPrato}>{item.prato}</Text>
                <Text style={styles.reportInfo}>{item.numVotos} {item.numVotos === 1 ? 'voto' : 'votos'}</Text>
            </View>
            <Text style={[styles.reportRatingValue, { color: color }]}>
                {item.avaliacaoMedia.toFixed(1)} <Star size={16} color={color} fill={color} />
            </Text>
        </View>
    );

    return (
        <View style={styles.profileScreen}>
            <PageHeader title="Relatório de Avaliações" onBack={() => navigate('ADMIN_DASHBOARD')} />
            <ScrollView contentContainerStyle={styles.reportContent}>
                <View>
                    <Text style={styles.reportSectionTitle}>🏆 Melhores Avaliações (Top 5)</Text>
                    {top5.length > 0 ? (
                        top5.map((item, index) => renderRatingCard(item, index, "#16a34a"))
                    ) : (
                        <Text style={styles.reportEmptyText}>Nenhum prato com votos suficientes.</Text>
                    )}
                </View>
               
                <View style={{ marginTop: 24 }}>
                    <Text style={styles.reportSectionTitle}>💔 Piores Avaliações</Text>
                    {worst5.length > 0 ? (
                        worst5.map((item, index) => renderRatingCard(item, index, "#dc2626"))
                    ) : (
                        <Text style={styles.reportEmptyText}>Nenhum prato com votos suficientes.</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}


// =================================================================
// ╔═════════════════════════════════════════════════════════════╗
// ║ 4. COMPONENTE PRINCIPAL (APP)                               ║
// ╚═════════════════════════════════════════════════════════════╝

export default function App() {
    // --- Lógica de Estado e Navegação ---
    const [currentScreen, setCurrentScreen] = useState('LOADING');
    const [activeTab, setActiveTab] = useState('Início');
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modal, setModal] = useState({ isOpen: false, message: '' });
    const [pratoDoDia, setPratoDoDia] = useState(null); // <--- 1. NOVO ESTADO

    // Funções de Ação e Lógica
    const showModalCallback = useCallback((message) => {
        setModal({ isOpen: true, message });
        setTimeout(() => { setModal({ isOpen: false, message: '' }); }, 2000);
    }, []);

    // --- MODIFICADO ---
    const navigate = useCallback((screen) => {
        setCurrentScreen(screen);
        let newActiveTab = activeTab;
        switch(screen) {
            case 'HOME': newActiveTab = 'Início'; break;
           
            // --- 2. Lógica de abas do Admin atualizada ---
            case 'ADMIN_DASHBOARD':
            case 'ADMIN_USER_MANAGEMENT':
            case 'ADMIN_ANNOUNCE':
            case 'ADMIN_RATINGS_REPORT':
                newActiveTab = 'Dashboard'; break;
            case 'ADMIN_EDIT_MENU':
                newActiveTab = 'Editar'; break; // <-- Nova aba

            case 'MENU': newActiveTab = 'Cardápio'; break;
            case 'PAYMENTS': case 'RECHARGE_PIX': newActiveTab = 'Financeiro'; break;
            case 'PROFILE': case 'PERSONAL_DATA': case 'NOTIFICATIONS': case 'SECURITY': newActiveTab = 'Config'; break;
            default: break;
        }
        if (newActiveTab !== activeTab) setActiveTab(newActiveTab);
    }, [activeTab]);
    // --- FIM DA MODIFICAÇÃO ---

    // --- MODIFICADO: updateUserStateAndStorage ---
    const updateUserStateAndStorage = useCallback((updatedUser) => {
        setUser(updatedUser); // Salva o usuário com a nova média
        const updatedUsersList = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        setUsers(updatedUsersList);
        if (Platform.OS === 'web') {
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsersList));
        }
    }, [users]);
    // --- FIM DA MODIFICAÇÃO ---

    // --- FUNÇÃO: Alteração de Senha ---
    const handleChangePassword = useCallback((currentPassword, newPassword) => {
        if (!user || user.password !== currentPassword) {
            return showModalCallback("Senha atual incorreta.");
        }

        const updatedUser = { ...user, password: newPassword };
        updateUserStateAndStorage(updatedUser);
        showModalCallback("Senha alterada com sucesso!");

    }, [user, showModalCallback, updateUserStateAndStorage]);

    const handleUpdateMenu = useCallback((updatedMenuItems) => {
        setMenuItems(updatedMenuItems);
        if (Platform.OS === 'web') {
            localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(updatedMenuItems));
        }
        showModalCallback("Cardápio atualizado!");
        navigate('ADMIN_DASHBOARD');
    }, [showModalCallback, navigate]);

    // --- Função silenciosa para atualizar o menu sem navegar ---
    const updateMenuStateAndStorage = useCallback((updatedMenuItems) => {
        setMenuItems(updatedMenuItems);
        if (Platform.OS === 'web') {
            localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(updatedMenuItems));
        }
    }, []); // Dependência vazia

    // --- Função para avaliar uma refeição (MODIFICADA) ---
    const handleRateMeal = useCallback((itemId, rating) => {
        // 1. Checa se já avaliou (usando .some() na nova estrutura)
        if (!user || user.refeicoesAvaliadas?.some(r => r.id === itemId)) return;

        // 2. Atualiza a média do Prato
        const updatedMenuItems = menuItems.map(item => {
            if (item.id === itemId) {
                const newTotal = item.avaliacaoTotal + rating;
                const newVotos = item.numVotos + 1;
                const newMedia = newTotal / newVotos;
                return {
                    ...item,
                    avaliacaoTotal: newTotal,
                    numVotos: newVotos,
                    avaliacaoMedia: newMedia
                };
            }
            return item;
        });

        // 3. Atualiza o Usuário e CALCULA A NOVA MÉDIA DO USUÁRIO
        const newRating = { id: itemId, rating: rating };
        const newRatingsArray = [...(user.refeicoesAvaliadas || []), newRating];
       
        const totalRatingSum = newRatingsArray.reduce((sum, item) => sum + item.rating, 0);
        const newOverallRating = totalRatingSum / newRatingsArray.length;

        const updatedUser = {
            ...user,
            refeicoesAvaliadas: newRatingsArray, // Salva o novo array de objetos
            avaliacaoMedia: newOverallRating // Salva a nova média calculada
        };
       
        // 4. Persistir e Atualizar Estados
        updateMenuStateAndStorage(updatedMenuItems);
        updateUserStateAndStorage(updatedUser); // Salva o usuário com a nova média
       
        showModalCallback(`Obrigado! Você deu ${rating} estrelas.`);

    }, [user, menuItems, updateMenuStateAndStorage, updateUserStateAndStorage, showModalCallback]);
    // --- FIM DA MODIFICAÇÃO ---


    // --- Carregamento Inicial (Simulando a persistência) ---
    useEffect(() => {
        try {
            const loadedUsers = INITIAL_USER_DATA;
            const loadedMenu = INITIAL_MENU_ITEMS_DATA;
            setUsers(loadedUsers);
            setMenuItems(loadedMenu);

            // --- 2. LÓGICA DO PRATO DO DIA MOVIDA PARA CÁ ---
            if (loadedMenu && loadedMenu.length > 0) {
                const randomIndex = Math.floor(Math.random() * loadedMenu.length);
                setPratoDoDia(loadedMenu[randomIndex]);
            }
            // --- FIM DA MODIFICAÇÃO ---
           
            navigate('LOGIN');
           
        } catch (error) {
            navigate('LOGIN');
            showModalCallback("Erro ao carregar dados.");
        } finally { setIsLoading(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Funções de Ação (Mantidas as mesmas) ---
    const handleLogin = useCallback((email, password) => {
        const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (foundUser) { setUser(foundUser); showModalCallback('Login efetuado!'); navigate(foundUser.isAdmin ? 'ADMIN_DASHBOARD' : 'HOME'); } else { showModalCallback('E-mail ou senha incorretos.'); }
    }, [users, showModalCallback, navigate]);

    // --- MODIFICADO: handleSignup ---
    const handleSignup = useCallback((nome, email, ra, password) => {
        const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (emailExists) { showModalCallback('Este e-mail já está cadastrado.'); return; }
       
        const newUser = {
            id: Date.now(),
            nome,
            email,
            matricula: ra,
            password,
            curso: "Não definido",
            saldo: 0,
            refeicoesMes: 0,
            agendamentos: 0,
            avaliacaoMedia: 0,
            refeicoesTotal: 0,
            economizado: 0,
            isAdmin: email.toLowerCase().includes('admin@'),
            createdAt: new Date().toISOString(),
            notifications: [],
            refeicoesAvaliadas: [] // <-- Garante que novos usuários tenham o array
        };
       
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        setUser(newUser);
        showModalCallback('Cadastro realizado!'); navigate('HOME');
    }, [users, showModalCallback, navigate]);
    // --- FIM DA MODIFICAÇÃO ---

    const handleLogout = useCallback(() => { setUser(null); navigate('LOGIN'); setActiveTab('Início'); }, [navigate]);
   
    // --- MODIFICADO: handleNewSchedule ---
    const handleNewSchedule = useCallback((cost, message) => {
        if (!user) return showModalCallback("Erro.");
        if (user.saldo < cost) { showModalCallback("Saldo insuficiente."); return; }
       
        const newNotification = {
            id: Date.now(),
            type: 'agendamento',
            message: message,
            cost: cost,
            status: 'ativo'
        };

        const updatedUser = {
            ...user,
            saldo: user.saldo - cost,
            agendamentos: (user.agendamentos || 0) + 1,
            notifications: [...(user.notifications || []), newNotification] // Adiciona a notificação
        };
        updateUserStateAndStorage(updatedUser);
    }, [user, showModalCallback, updateUserStateAndStorage]);
    // --- FIM DA MODIFICAÇÃO ---

    // --- NOVO: handleCancelSchedule ---
    const handleCancelSchedule = useCallback((notificationId) => {
        if (!user) return;

        const notification = user.notifications.find(n => n.id === notificationId);
        if (!notification || notification.status === 'cancelado') return;

        // Mapeia as notificações e atualiza a específica
        const updatedNotifications = user.notifications.map(n =>
            n.id === notificationId
            ? { ...n, status: 'cancelado', message: `(Cancelado) ${n.message}` }
            : n
        );

        const updatedUser = {
            ...user,
            saldo: user.saldo + notification.cost, // Devolve o dinheiro
            agendamentos: user.agendamentos - 1,  // Decrementa agendamentos
            notifications: updatedNotifications       // Salva a lista atualizada
        };

        updateUserStateAndStorage(updatedUser);
        showModalCallback("Agendamento cancelado e estornado!");

    }, [user, updateUserStateAndStorage, showModalCallback]);
    // --- FIM DO NOVO HANDLER ---

    const handleRecharge = useCallback((amount) => { if (!user || amount <= 0) return showModalCallback("Erro."); const updatedUser = { ...user, saldo: (user.saldo || 0) + amount }; updateUserStateAndStorage(updatedUser); showModalCallback(`R$ ${amount.toFixed(2).replace('.',',')} adicionado!`); navigate('PAYMENTS'); }, [user, showModalCallback, navigate, updateUserStateAndStorage]);


    // --- NOVO: handleManualCredit (Feature 2) ---
    const handleManualCredit = useCallback((userId, amount) => {
        const userToUpdate = users.find(u => u.id === userId);
        if (!userToUpdate) return showModalCallback("Erro: Usuário não encontrado.");

        const newNotification = {
            id: Date.now(),
            type: 'credito',
            message: `Ajuste manual de R$ ${amount.toFixed(2)} aplicado.`,
            status: 'info'
        };

        const updatedUser = {
            ...userToUpdate,
            saldo: userToUpdate.saldo + amount,
            notifications: [...(userToUpdate.notifications || []), newNotification]
        };

        // Atualiza a lista de usuários
        const updatedUsersList = users.map(u => u.id === userId ? updatedUser : u);
        setUsers(updatedUsersList);
        if (Platform.OS === 'web') {
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsersList));
        }

        showModalCallback("Saldo ajustado com sucesso!");

    }, [users, showModalCallback]);

    // --- NOVO: handleSendAnnouncement (Feature 4) ---
    const handleSendAnnouncement = useCallback((message) => {
        const newNotif = { id: Date.now(), type: 'aviso', message, status: 'info' };

        const newUsersList = users.map(u => ({
            ...u,
            notifications: [...(u.notifications || []), newNotif]
        }));

        setUsers(newUsersList);
        if (Platform.OS === 'web') {
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsersList));
        }

        // Atualiza o estado do usuário admin logado, se for o caso
        if (user?.id) {
            const updatedCurrentUser = newUsersList.find(u => u.id === user.id);
            if (updatedCurrentUser) setUser(updatedCurrentUser);
        }

        showModalCallback("Anúncio enviado!");
        navigate('ADMIN_DASHBOARD');

    }, [users, user, navigate, showModalCallback]);


    // --- Renderização de Telas (MODIFICADO) ---
    const renderScreen = () => {
        if (isLoading) return <LoadingScreen />;
        if (!user) { if (currentScreen === 'SIGNUP') return <SignupScreen navigate={navigate} onSignup={handleSignup} showModal={showModalCallback} />; return <LoginScreen navigate={navigate} onLogin={handleLogin} showModal={showModalCallback} />; }

        switch (currentScreen) {
            case 'HOME': return <HomeScreen navigate={navigate} user={user} menuItems={menuItems} pratoDoDia={pratoDoDia} />;
            case 'MENU': return <MenuScreen navigate={navigate} menuItems={menuItems} user={user} onRateMeal={handleRateMeal} />;
            case 'SCHEDULE': return <ScheduleScreen navigate={navigate} showModal={showModalCallback} user={user} onScheduleSuccess={handleNewSchedule} />;
            case 'PAYMENTS': return <PaymentsScreen navigate={navigate} user={user} />;
            case 'RECHARGE_PIX': return <RechargePixScreen navigate={navigate} showModal={showModalCallback} onRecharge={handleRecharge} />;
            
            // --- ROTAS ATUALIZADAS ---
            case 'PERSONAL_DATA': return <PersonalDataScreen navigate={navigate} user={user} />;
            case 'SECURITY': return <SecurityScreen navigate={navigate} onChangePassword={handleChangePassword} showModal={showModalCallback} />;
            case 'NOTIFICATIONS': return <NotificationsScreen navigate={navigate} user={user} onCancelSchedule={handleCancelSchedule} />;
            case 'PROFILE': return <ProfileScreen navigate={navigate} user={user} onLogout={handleLogout} />;
            
            // --- ROTAS DE ADMIN ATUALIZADAS (Passando menuItems e pratoDoDia) ---
            case 'ADMIN_DASHBOARD': return user.isAdmin ? <AdminDashboardScreen navigate={navigate} menuItems={menuItems} pratoDoDia={pratoDoDia} /> : <HomeScreen navigate={navigate} user={user} menuItems={menuItems} pratoDoDia={pratoDoDia}/>;
            case 'ADMIN_EDIT_MENU': return user.isAdmin ? <AdminEditMenuScreen navigate={navigate} currentMenu={menuItems} onSave={handleUpdateMenu} /> : <HomeScreen navigate={navigate} user={user} menuItems={menuItems} pratoDoDia={pratoDoDia}/>;
            case 'ADMIN_USER_MANAGEMENT': return user.isAdmin ? <AdminUserManagementScreen navigate={navigate} users={users} onManualCredit={handleManualCredit} showModal={showModalCallback} /> : <HomeScreen navigate={navigate} user={user} menuItems={menuItems} pratoDoDia={pratoDoDia}/>;
            case 'ADMIN_ANNOUNCE': return user.isAdmin ? <AdminAnnounceScreen navigate={navigate} onSendAnnouncement={handleSendAnnouncement} showModal={showModalCallback} /> : <HomeScreen navigate={navigate} user={user} menuItems={menuItems} pratoDoDia={pratoDoDia}/>;
            case 'ADMIN_RATINGS_REPORT': return user.isAdmin ? <AdminRatingsReportScreen navigate={navigate} menuItems={menuItems} /> : <HomeScreen navigate={navigate} user={user} menuItems={menuItems} pratoDoDia={pratoDoDia}/>;

            default: return user.isAdmin ? <AdminDashboardScreen navigate={navigate} menuItems={menuItems} pratoDoDia={pratoDoDia}/> : <HomeScreen navigate={navigate} user={user} menuItems={menuItems} pratoDoDia={pratoDoDia}/>;
        }
    };

    // --- MODIFICADO: Lista de exclusão do BottomNav ---
    const showBottomNav = !isLoading && user && !['LOGIN','SIGNUP','SCHEDULE','RECHARGE_PIX', 'PERSONAL_DATA', 'NOTIFICATIONS', 'SECURITY', 'ADMIN_USER_MANAGEMENT', 'ADMIN_ANNOUNCE', 'ADMIN_RATINGS_REPORT'].includes(currentScreen);

    return (
        <View style={styles.fullAppContainer}>
            {/* Modal de Feedback */}
            {modal.isOpen && <Modal message={modal.message} onClose={() => setModal({ isOpen: false, message: '' })} />}

            <View style={{ flex: 1 }}>
                {renderScreen()}
            </View>

            {showBottomNav && user && (
                <BottomNavBar
                    activeTab={activeTab}
                    userIsAdmin={user.isAdmin}
                    setActiveTab={(tab) => {
                        setActiveTab(tab);
                        // --- 3. Lógica de clique da BottomNav atualizada ---
                        if (tab === 'Início') navigate('HOME');
                        else if (tab === 'Dashboard') navigate(user.isAdmin ? 'ADMIN_DASHBOARD' : 'HOME');
                        else if (tab === 'Editar') navigate('ADMIN_EDIT_MENU'); // <--- ADICIONADO
                        else if (tab === 'Cardápio') navigate('MENU');
                        else if (tab === 'Financeiro') navigate('PAYMENTS');
                        else if (tab === 'Config') navigate('PROFILE');
                    }}
                />
            )}
        </View>
    );
}

// =================================================================
// ╔═════════════════════════════════════════════════════════════╗
// ║ 5. ESTILOS REACT NATIVE (StyleSheet)                        ║
// ╚═════════════════════════════════════════════════════════════╝

const styles = StyleSheet.create({
    // --- Estrutura Básica (Ajustada para Full Screen) ---
    fullAppContainer: {
        flex: 1,
        backgroundColor: '#f9fafb', // Fundo principal
    },
    fullScreenContainer: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 0,
    },
    screenContentScroll: {
        paddingBottom: 80, // Espaço para a BottomNav
        flexGrow: 1,
    },
    screenContentScrollNoPadding: { // Usado em telas que não tem bottom nav
        flexGrow: 1,
    },

    // --- Loading ---
    loadingOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 60,
    },

    // --- Header e Navegação ---
    // Localize este estilo no seu const styles = StyleSheet.create({...})
    pageHeader: {
        // ESTE É O PADDING QUE EMPURRA O TÍTULO PARA BAIXO (20 Android / 60 iOS)
        paddingTop: Platform.OS === 'android' ? 20 : 60, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        backgroundColor: 'white', // A cor branca agora cobre a Status Bar
    },
    // Localize este estilo no seu const styles = StyleSheet.create({...})
    pageHeaderBackButton: {
        position: 'absolute',
        left: 16,
        padding: 8,
        // CORREÇÃO: Usa o mesmo valor do paddingTop do header
        top: Platform.OS === 'android' ? 20 : 60, 
    },
    pageHeaderTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1f2937',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 15 : 0,
        zIndex: 10,
    },
    navItem: {
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        color: '#9ca3af',
    },
    navItemActive: {
        color: '#2563eb',
    },
    navItemLabel: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 4,
        color: '#9ca3af',
    },
    navItemLabelActive: {
        color: '#2563eb',
        fontWeight: '600',
    },

    // --- Botão Principal ---
    mainButton: {
        width: '100%',
        backgroundColor: '#2563eb',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 32,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    mainButtonSmall: {
        paddingVertical: 12,
        marginTop: 20,
    },
    mainButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 18,
    },

    // --- Modal ---
    modalOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 50,
        padding: 24,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 16,
        width: '100%',
        maxWidth: 320,
        alignItems: 'center',
    },
    ratingModalContent: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 16,
        width: '100%',
        maxWidth: 320,
        alignItems: 'center',
    },
    ratingModalTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    ratingModalSubtitle: {
        fontSize: 16,
        color: '#4b5563',
        marginBottom: 20,
        textAlign: 'center',
    },
    starContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    starIcon: {
        padding: 4,
    },
    modalMessage: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalButton: {
        width: '100%',
        backgroundColor: '#2563eb',
        paddingVertical: 10,
        borderRadius: 8,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
    },
    confirmModalOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 50,
        padding: 24,
    },
    confirmModalContent: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 16,
        width: '100%',
        maxWidth: 320,
        alignItems: 'center',
    },
    confirmModalTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    confirmModalMessage: {
        fontSize: 16,
        color: '#4b5563',
        marginBottom: 24,
        textAlign: 'center',
    },
    confirmModalButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    confirmModalButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmButtonCancel: { backgroundColor: '#f3f4f6' },
    confirmButtonCancelText: { color: '#374151', fontWeight: '600' },
    confirmButtonConfirm: { backgroundColor: '#2563eb' },
    confirmButtonConfirmText: { color: 'white', fontWeight: '600' },


    // --- Login Screen ---
    loginScreenContent: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'android' ? 20 : 60,
    },
    ruLogoContainer: {
        marginBottom: 24,
        alignItems: 'center',
    },
    ruLogoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2563eb',
        marginTop: 5,
    },
    loginTitle: {
        fontSize: 30,
        fontWeight: '700',
        marginBottom: 8,
        color: '#1f2937',
    },
    loginSubtitle: {
        fontSize: 16,
        color: '#4b5563',
        marginBottom: 32,
    },
    loginFormGroup: {
        width: '100%',
        marginBottom: 24,
        gap: 16,
    },
    inputContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputIcon: {
        position: 'absolute',
        left: 16,
        zIndex: 1,
    },
    inputField: {
        flex: 1,
        paddingLeft: 48,
        paddingRight: 16,
        paddingVertical: 12,
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        fontSize: 16,
        color: '#1f2937',
    },
    loginLinkContainer: {
        marginTop: 24,
    },
    loginLinkText: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
    },
    loginLink: {
        fontWeight: '600',
        color: '#2563eb',
    },

    // --- Signup Screen ---
    signupScreen: {
        flex: 1,
        padding: 24,
        backgroundColor: 'white',
    },
    signupBackButton: {
        position: 'absolute',
        top: Platform.OS === 'android' ? 20 : 60,
        left: 16,
        padding: 8,
        zIndex: 10,
    },
    signupIntroContainer: {
        marginTop: 48,
        marginBottom: 24,
        alignItems: 'center',
    },
    signupTitle: {
        fontSize: 30,
        fontWeight: '700',
        marginBottom: 8,
    },
    signupSubtitle: {
        fontSize: 16,
        color: '#4b5563',
    },
    signupFormGroup: {
        gap: 16,
        marginBottom: 24,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    termsCheckbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#9ca3af',
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    termsCheckboxChecked: {
        backgroundColor: '#2563eb',
        borderColor: '#2563eb',
    },
    termsLabel: {
        fontSize: 14,
        color: '#6b7280',
        flexShrink: 1,
    },
    termsLink: {
        fontWeight: '600',
        color: '#2563eb',
    },
    signupLinkContainer: {
        marginTop: 24,
        alignItems: 'center',
    },

    // --- Home Screen ---
    homeScreen: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    homeHeader: {
        backgroundColor: '#2563eb',
        paddingTop: Platform.OS === 'android' ? 20 : 60,
        paddingHorizontal: 24,
        paddingBottom: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        justifyContent: 'center',
    },
    homeHeaderContent: {
        // Wrapper para o conteúdo do header
    },
    homeHeaderBalance: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    balanceTextSm: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    balanceTextLg: {
        fontSize: 30,
        fontWeight: '700',
        color: 'white',
        marginVertical: 4,
    },
    balanceIconWrapper: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 12,
        borderRadius: 8,
    },
    homeRechargeButton: {
        width: '100%',
        backgroundColor: 'white',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 20,
    },
    homeRechargeButtonText: {
        color: '#2563eb',
        fontWeight: '600',
        textAlign: 'center',
    },
    homeMetricsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 24,
        gap: 16,
    },
    metricCard: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 16,
        flex: 1,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    metricCardIconWrapper: {
        padding: 8,
        backgroundColor: '#f3f4f6',
        borderRadius: 9999,
        marginBottom: 4,
    },
    metricCardLabel: {
        fontSize: 12,
        color: '#4b5563',
        textAlign: 'center',
    },
    metricCardValue: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 4,
    },
    homeActionsContainer: {
        paddingHorizontal: 24,
        marginBottom: 24, // Adicionado margin bottom
    },
    homeSectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
    },
    homeActionsGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    actionCard: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    actionCardIconWrapper: {
        padding: 12,
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        marginRight: 16,
    },
    actionCardTitle: {
        fontWeight: '700',
        color: '#1f2937',
        fontSize: 16,
    },
    actionCardSubtitle: {
        fontSize: 14,
        color: '#6b7280',
    },

    homeChartCard: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },

    // --- Menu Screen ---
    menuScreen: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    menuList: {
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    menuListEmpty: {
        textAlign: 'center',
        paddingVertical: 32,
        color: '#6b7280',
    },
    menuItemCard: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 16,
    },
    menuItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    menuItemDay: {
        fontWeight: '700',
        fontSize: 18,
    },
    menuItemKcal: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4b5563',
    },
    menuItemDetails: {
        color: '#374151',
        marginBottom: 12,
    },
    menuItemTag: {
        fontSize: 12,
        fontWeight: '500',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 9999,
        alignSelf: 'flex-start',
        marginTop: 4, // Para separar do texto do prato
    },
    menuItemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    menuItemRating: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuItemRatingText: {
        fontSize: 14,
        color: '#4b5563',
        marginLeft: 4,
    },
    rateButton: {
        backgroundColor: '#2563eb',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    rateButtonDisabled: {
        backgroundColor: '#9ca3af',
    },
    rateButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    menuColorBlue: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' },
    menuTagBlue: { backgroundColor: '#dbeafe', color: '#1d4ed8' },
    menuColorGreen: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
    menuTagGreen: { backgroundColor: '#dcfce7', color: '#16a34a' },
    menuColorTeal: { backgroundColor: '#f0fdfa', borderColor: '#99f6e4' },
    menuTagTeal: { backgroundColor: '#ccfbf1', color: '#0d9488' },

    // --- Schedule Screen ---
    scheduleScreen: { flex: 1, backgroundColor: 'white', },
    scheduleContent: { padding: 24, flexGrow: 1, },
    scheduleSection: { marginTop: 24, },
    scheduleSectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, },
    scheduleDayGrid: { flexDirection: 'row', gap: 16, marginBottom: 24, },
    scheduleButton: { padding: 16, borderRadius: 12, borderWidth: 2, borderColor: '#e5e7eb', backgroundColor: 'white', flex: 1, },
    scheduleButtonSelected: { backgroundColor: '#eff6ff', borderColor: '#3b82f6', },
    scheduleButtonTitle: { fontWeight: '700', fontSize: 18, },
    scheduleButtonSubtitle: { color: '#6b7280', fontSize: 14, },
    scheduleMealOptions: { gap: 16, marginBottom: 32, },
    // --- Payments Screen ---
    paymentsScreen: { flex: 1, backgroundColor: '#f3f4f6', },
    paymentsContent: { padding: 24, flexGrow: 1, },
    paymentsBalanceCard: { marginTop: 24, alignItems: 'center', },
    paymentsBalanceLabel: { fontSize: 14, color: '#4b5563', },
    paymentsBalanceValue: { fontSize: 36, fontWeight: '700', marginVertical: 8, },
    paymentsRechargeCard: { backgroundColor: 'white', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2, marginTop: 24, width: '100%', },
    paymentsRechargeTitle: { fontWeight: '700', fontSize: 18, marginBottom: 16, },
    paymentsOptionsList: { gap: 16, },
    paymentOptionButton: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: '#f9fafb', borderRadius: 8, },
    paymentOptionLabel: { fontWeight: '600', },
    paymentOptionIconRight: { marginLeft: 'auto', },
    // --- Recharge Pix Screen ---
    rechargeScreen: { flex: 1, backgroundColor: 'white', },
    rechargeContent: { padding: 24, alignItems: 'center', flex: 1, },
    rechargeQrContainer: { marginTop: 32, marginBottom: 32, padding: 24, borderWidth: 2, borderColor: '#e5e7eb', borderRadius: 16, backgroundColor: '#f9fafb', },
    rechargeInstructions: { textAlign: 'center', color: '#4b5563', marginBottom: 24, },
    pixKeyContainer: {
        width: '100%',
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        alignItems: 'center',
    },
    pixKeyLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 4,
    },
    pixKeyValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        textAlign: 'center',
        marginBottom: 12,
    },
    copyPixButton: {
        backgroundColor: '#059669',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    copyPixButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 14,
    },
    rechargeInputContainer: { width: '100%', marginBottom: 16, },
    // --- Profile Screen ---
    profileScreen: { flex: 1, backgroundColor: '#f3f4f6', },
    profileUserInfo: { alignItems: 'center', padding: 24, },
    profileAvatar: { width: 96, height: 96, borderRadius: 9999, backgroundColor: '#dbeafe', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 4, borderColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4, },
    profileName: { fontSize: 24, fontWeight: '700', color: '#1f2937', },
    profileEmail: { color: '#4b5563', fontSize: 16, },
    profileMatricula: { color: '#6b7280', marginTop: 4, fontSize: 14, },
    profileMenu: { backgroundColor: 'white', marginHorizontal: 24, padding: 16, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2, gap: 8, },
    profileMenuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 8, },
    profileMenuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 16, },
    profileMenuIconWrapper: { padding: 8, backgroundColor: '#f3f4f6', borderRadius: 8, },
    profileMenuLabel: { fontWeight: '600', color: '#374151', },
    profileLogoutContainer: { padding: 24, },
    logoutButton: { width: '100%', backgroundColor: '#fee2e2', paddingVertical: 12, borderRadius: 12, alignItems: 'center', },
    logoutButtonText: { color: '#dc2626', fontWeight: '600', fontSize: 18, },
    // --- Estilos Dados Pessoais ---
    profileDataContent: {
        padding: 24,
        flexGrow: 1,
        gap: 16,
    },
    dataCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    dataLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 4,
        fontWeight: '500',
    },
    dataValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
    },
    passwordCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 80, // Espaço final
    },
    passwordTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
        color: '#1f2937',
    },
    passwordButton: {
        backgroundColor: '#f3f4f6',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    passwordButtonText: {
        color: '#2563eb',
        fontWeight: '600',
    },
    passwordEditContainer: {
        gap: 12,
    },
    cancelButton: {
        marginTop: 10,
        paddingVertical: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#dc2626',
        fontWeight: '600',
    },
   
    // --- Estilos de Notificações ---
    notificationsContent: {
        padding: 24,
        gap: 16,
        paddingBottom: 80,
    },
    notificationsEmpty: {
        textAlign: 'center',
        color: '#6b7280',
        fontSize: 16,
        marginTop: 48,
    },
    notificationCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    notificationIcon: {
        padding: 8,
        backgroundColor: '#f3f4f6',
        borderRadius: 999,
        marginRight: 12,
    },
    notificationBody: {
        flex: 1,
    },
    notificationMessage: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
    },
    notificationMessageCanceled: {
        color: '#9ca3af',
        textDecorationLine: 'line-through',
    },
    notificationDate: {
        fontSize: 12,
        color: '#6b7280',
    },
    notificationAction: {
        marginLeft: 8,
        alignItems: 'center',
    },
    cancelScheduleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fee2e2',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    cancelScheduleButtonText: {
        color: '#dc2626',
        fontWeight: '600',
        fontSize: 12,
        marginLeft: 4,
    },
    canceledText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9ca3af',
    },
   
    // --- Admin Dashboard Screen ---
    adminScreen: { flex: 1, backgroundColor: '#f3f4f6', },
    adminContent: { padding: 24, gap: 24, flexGrow: 1, },
    adminSectionTitle: { fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 16, paddingTop: Platform.OS === 'android' ? 20 : 60,},
    adminStatsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', },
    adminStatCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 16,
        flex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    adminStatIconWrapper: { padding: 8, backgroundColor: '#f3f4f6', borderRadius: 9999, marginBottom: 8, alignSelf: 'flex-start', },
    adminStatLabel: { fontSize: 12, color: '#6b7280', },
    adminStatValue: { fontSize: 20, fontWeight: '700', },
    adminActionsCard: { backgroundColor: 'white', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2, },
    adminActionsTitle: { fontWeight: '700', fontSize: 18, marginBottom: 12, },
    adminActionsList: { gap: 12, },
    adminActionButton: { width: '100%', paddingVertical: 12, borderRadius: 8, fontWeight: '600', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', },
    adminButtonBlue: { backgroundColor: '#dbeafe' },
    adminButtonGreen: { backgroundColor: '#dcfce7' },
    adminButtonYellow: { backgroundColor: '#fef9c3' },

    adminChartCard: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        flex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
   
    // --- Admin Edit Menu Screen ---
    adminEditMenuScreen: { flex: 1, backgroundColor: '#f3f4f6', },
    adminEditMenuContent: { padding: 24, gap: 24, paddingBottom: 90 },
    editMenuItemCard: { backgroundColor: 'white', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2, },
    editMenuItemDay: { fontWeight: '700', fontSize: 18, marginBottom: 16, },
    editMenuFormGroup: { gap: 12, },
    editMenuLabel: { fontWeight: '500', fontSize: 14, color: '#374151', marginBottom: 4, },
    editMenuInput: { width: '100%', paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#f9fafb', borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db', fontSize: 16, },
    saveButtonContainer: {
        padding: 24,
        backgroundColor: '#f3f4f6', // Fundo para não ficar transparente
        borderTopWidth: 1,
        borderColor: '#e5e7eb',
    },

    // --- Admin User Management (NOVOS ESTILOS) ---
    userSearchContainer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        backgroundColor: '#f3f4f6',
    },
    userListContent: {
        padding: 24,
        gap: 16,
    },
    userCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    userBalance: {
        fontSize: 14,
        fontWeight: '700',
        color: '#16a34a',
        marginTop: 4,
    },
    creditButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dbeafe',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginLeft: 'auto',
    },
    creditButtonText: {
        color: '#1d4ed8',
        fontWeight: '600',
        fontSize: 12,
        marginLeft: 4,
    },

    // --- Admin Announce Screen (NOVOS ESTILOS) ---
    announceInput: {
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
        fontSize: 16,
        textAlignVertical: 'top', // Para Android
        height: 150,
    },

    // --- Admin Ratings Report (NOVOS ESTILOS) ---
    reportContent: {
        padding: 24,
        gap: 16,
    },
    reportSectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 16,
    },
    reportCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 12,
    },
    reportRank: {
        fontSize: 18,
        fontWeight: '600',
        color: '#9ca3af',
        marginRight: 16,
    },
    reportBody: {
        flex: 1,
    },
    reportPrato: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        flexShrink: 1, // Garante que o texto quebre a linha
    },
    reportInfo: {
        fontSize: 12,
        color: '#6b7280',
    },
    reportRatingValue: {
        fontSize: 20,
        fontWeight: '800',
        marginLeft: 16,
    },
    reportEmptyText: {
        textAlign: 'center',
        color: '#6b7280',
        fontSize: 14,
        paddingVertical: 16,
    },
});