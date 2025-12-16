'use client'

import { useState, useEffect } from 'react'
import { Crown, TrendingUp, Users, DollarSign, ArrowRight, Clock, CheckCircle2, Zap, Target, Award } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type UserType = 'creator' | 'user' | null
type Step = 'welcome' | 'profile' | 'opportunity' | 'mentorship' | 'dashboard' | 'signup'

export default function LyberhotQuiz() {
  const [step, setStep] = useState<Step>('welcome')
  const [userType, setUserType] = useState<UserType>(null)
  const [remainingSpots, setRemainingSpots] = useState(47)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutos em segundos
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    instagram: ''
  })

  // Contador regressivo
  useEffect(() => {
    if (step === 'signup' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [step, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type)
    if (type === 'creator') {
      setStep('opportunity')
    } else {
      // Redirecionar usuários comuns para outra página
      alert('Funcionalidade para usuários em breve!')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Salvar no Supabase
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([
          {
            name: formData.name,
            whatsapp: formData.whatsapp,
            instagram: formData.instagram,
            user_type: userType || 'creator',
            is_founder: true
          }
        ])
        .select()

      if (error) {
        console.error('Erro ao salvar:', error)
        alert('Erro ao processar sua solicitação. Por favor, tente novamente.')
        return
      }

      // Sucesso!
      alert(`🎉 Parabéns ${formData.name}! Sua vaga de Membro Fundador foi garantida. Entraremos em contato via WhatsApp em breve.`)
      
      // Resetar formulário
      setFormData({ name: '', whatsapp: '', instagram: '' })
      setRemainingSpots(prev => Math.max(0, prev - 1))
      
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao processar sua solicitação. Por favor, tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Tela de Boas-Vindas */}
      {step === 'welcome' && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
          <div className="max-w-2xl w-full text-center space-y-8">
            {/* Logo Lyberhot */}
            <div className="inline-block">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/9ef128dc-4f23-4d1c-8cc3-df7346bbff2f.png" 
                alt="Lyberhot Logo" 
                className="h-32 w-auto mx-auto mb-4"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[#FFD700]">
              Lyberhot: Onde o Exclusivo Acontece.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              O ambiente seguro para conexões reais e liberdade absoluta. Identifique-se para liberar seu acesso.
            </p>
            <button
              onClick={() => setStep('profile')}
              className="group relative px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold text-lg rounded-full hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-[#FFD700]/50"
            >
              SOLICITAR ACESSO
              <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Seleção de Perfil */}
      {step === 'profile' && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
          <div className="max-w-4xl w-full space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-[#FFD700]">
                Defina seu perfil
              </h2>
              <p className="text-xl text-gray-400">
                Escolha a opção que melhor descreve você
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Card Criador */}
              <button
                onClick={() => handleUserTypeSelect('creator')}
                className="group relative p-8 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#FFD700] rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-[#FFD700]/30"
              >
                <Crown className="w-16 h-16 text-[#FFD700] mb-4 mx-auto" />
                <h3 className="text-2xl font-bold text-[#FFD700] mb-2">Sou Criador</h3>
                <p className="text-gray-400">
                  Monetize seu conteúdo e construa seu império digital
                </p>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-[#FFD700] text-black text-xs font-bold rounded-full">
                    VIP
                  </span>
                </div>
              </button>

              {/* Card Usuário */}
              <button
                onClick={() => handleUserTypeSelect('user')}
                className="group relative p-8 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-gray-700 rounded-2xl hover:scale-105 transition-all duration-300 hover:border-gray-500"
              >
                <Users className="w-16 h-16 text-gray-400 mb-4 mx-auto" />
                <h3 className="text-2xl font-bold text-white mb-2">Sou Usuário</h3>
                <p className="text-gray-400">
                  Acesse conteúdo exclusivo dos melhores criadores
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tela 3.1: Revelação da Oportunidade - CORRIGIDA PARA 25% */}
      {step === 'opportunity' && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
          <div className="max-w-6xl w-full space-y-12">
            {/* Badge de Urgência */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 rounded-full animate-pulse">
                <Clock className="w-5 h-5" />
                <span className="font-bold">Restam apenas {remainingSpots} vagas de Fundador</span>
              </div>
            </div>

            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold text-[#FFD700]">
                Comparação de Lucros
              </h2>
              <p className="text-xl md:text-2xl text-gray-300">
                Veja quanto você <span className="text-[#FFD700] font-bold">PERDE</span> nas outras plataformas
              </p>
            </div>

            {/* COMPARAÇÃO VISUAL MELHORADA - 3 COLUNAS - CORRIGIDA PARA 25% */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Coluna 1: Concorrentes - CORRIGIDO PARA 25% */}
              <div className="bg-gradient-to-br from-red-950/30 to-red-900/20 border-2 border-red-600/50 rounded-2xl p-6 space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/20 rounded-full mb-4">
                    <TrendingUp className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-red-400 mb-2">Outras Plataformas</h3>
                  <p className="text-sm text-gray-400">OnlyFans, Privacy, etc.</p>
                </div>

                {/* Barra Visual - CORRIGIDA PARA 25% */}
                <div className="space-y-3">
                  <div className="relative h-64 bg-gray-900 rounded-xl overflow-hidden">
                    {/* Parte que você fica - 75% */}
                    <div className="absolute bottom-0 w-full h-[75%] bg-gradient-to-t from-red-600 to-red-500 flex flex-col items-center justify-center">
                      <span className="text-5xl font-bold text-white">75%</span>
                      <span className="text-sm text-white/80 mt-2">Você fica</span>
                    </div>
                    {/* Parte da plataforma - 25% */}
                    <div className="absolute top-0 w-full h-[25%] bg-gradient-to-b from-gray-700 to-gray-600 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white">25%</span>
                      <span className="text-xs text-white/70">Plataforma</span>
                    </div>
                  </div>
                </div>

                {/* Exemplo Prático - CORRIGIDO PARA 25% */}
                <div className="bg-black/50 rounded-xl p-4 space-y-2">
                  <p className="text-sm text-gray-400 text-center">Exemplo prático:</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Você fatura:</span>
                      <span className="text-white font-bold">R$ 10.000</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-700 pt-1">
                      <span className="text-red-400">Taxa (25%):</span>
                      <span className="text-red-400 font-bold">- R$ 2.500</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-700 pt-1">
                      <span className="text-white">Você recebe:</span>
                      <span className="text-white font-bold">R$ 7.500</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coluna 2: Lyberhot Padrão - 20% */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-2 border-gray-600 rounded-2xl p-6 space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700/30 rounded-full mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-300 mb-2">Lyberhot Padrão</h3>
                  <p className="text-sm text-gray-500">Criador Normal</p>
                </div>

                {/* Barra Visual - 20% */}
                <div className="space-y-3">
                  <div className="relative h-64 bg-gray-900 rounded-xl overflow-hidden">
                    {/* Parte que você fica - 80% */}
                    <div className="absolute bottom-0 w-full h-[80%] bg-gradient-to-t from-gray-500 to-gray-400 flex flex-col items-center justify-center">
                      <span className="text-5xl font-bold text-white">80%</span>
                      <span className="text-sm text-white/80 mt-2">Você fica</span>
                    </div>
                    {/* Parte da plataforma - 20% */}
                    <div className="absolute top-0 w-full h-[20%] bg-gradient-to-b from-gray-700 to-gray-600 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white">20%</span>
                      <span className="text-xs text-white/70">Plataforma</span>
                    </div>
                  </div>
                </div>

                {/* Exemplo Prático - 20% */}
                <div className="bg-black/50 rounded-xl p-4 space-y-2">
                  <p className="text-sm text-gray-400 text-center">Exemplo prático:</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Você fatura:</span>
                      <span className="text-white font-bold">R$ 10.000</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-700 pt-1">
                      <span className="text-gray-400">Taxa (20%):</span>
                      <span className="text-gray-400 font-bold">- R$ 2.000</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-700 pt-1">
                      <span className="text-white">Você recebe:</span>
                      <span className="text-white font-bold">R$ 8.000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coluna 3: Lyberhot FUNDADOR - 15% - DESTAQUE */}
              <div className="relative bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/10 border-4 border-[#FFD700] rounded-2xl p-6 space-y-6 shadow-2xl shadow-[#FFD700]/50 animate-pulse">
                {/* Badge de Destaque */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="px-6 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full shadow-xl">
                    <span className="text-black font-bold text-sm flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      MELHOR ESCOLHA
                    </span>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFD700]/20 rounded-full mb-4">
                    <Crown className="w-8 h-8 text-[#FFD700]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#FFD700] mb-2">Lyberhot FUNDADOR</h3>
                  <p className="text-sm text-[#FFD700]/80">Apenas 150 vagas</p>
                </div>

                {/* Barra Visual - 15% */}
                <div className="space-y-3">
                  <div className="relative h-64 bg-gray-900 rounded-xl overflow-hidden border-2 border-[#FFD700]">
                    {/* Parte que você fica - 85% */}
                    <div className="absolute bottom-0 w-full h-[85%] bg-gradient-to-t from-[#FFD700] to-[#FFA500] flex flex-col items-center justify-center">
                      <span className="text-6xl font-bold text-black">85%</span>
                      <span className="text-sm text-black/80 mt-2 font-bold">Você fica</span>
                    </div>
                    {/* Parte da plataforma - 15% */}
                    <div className="absolute top-0 w-full h-[15%] bg-gradient-to-b from-gray-700 to-gray-600 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-white">15%</span>
                      <span className="text-xs text-white/70">Plataforma</span>
                    </div>
                  </div>
                </div>

                {/* Exemplo Prático - 15% */}
                <div className="bg-black/70 rounded-xl p-4 space-y-2 border-2 border-[#FFD700]">
                  <p className="text-sm text-[#FFD700] text-center font-bold">Exemplo prático:</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Você fatura:</span>
                      <span className="text-white font-bold">R$ 10.000</span>
                    </div>
                    <div className="flex justify-between border-t border-[#FFD700]/30 pt-1">
                      <span className="text-[#FFD700]">Taxa (15%):</span>
                      <span className="text-[#FFD700] font-bold">- R$ 1.500</span>
                    </div>
                    <div className="flex justify-between border-t border-[#FFD700] pt-1">
                      <span className="text-[#FFD700] font-bold">Você recebe:</span>
                      <span className="text-[#FFD700] font-bold text-lg">R$ 8.500</span>
                    </div>
                  </div>
                </div>

                {/* Benefício Extra */}
                <div className="bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 rounded-xl p-4 border border-[#FFD700]">
                  <div className="flex items-start gap-3">
                    <Zap className="w-6 h-6 text-[#FFD700] flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-[#FFD700] font-bold text-sm mb-1">BÔNUS EXCLUSIVO:</p>
                      <p className="text-white text-sm">+ 5% vitalício de cada criador que você indicar!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparação Direta - Tabela Resumo - CORRIGIDA PARA 25% */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#FFD700] rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-center text-[#FFD700] mb-6">
                Resumo: Quanto você GANHA a mais como Fundador
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-[#FFD700]">
                      <th className="pb-4 text-gray-400">Faturamento</th>
                      <th className="pb-4 text-red-400 text-center">Concorrentes (25%)</th>
                      <th className="pb-4 text-gray-400 text-center">Lyberhot Padrão (20%)</th>
                      <th className="pb-4 text-[#FFD700] text-center">Fundador (15%)</th>
                      <th className="pb-4 text-green-400 text-center">Você GANHA</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm md:text-base">
                    <tr className="border-b border-gray-800">
                      <td className="py-4 text-white font-bold">R$ 5.000</td>
                      <td className="py-4 text-center text-red-400">R$ 3.750</td>
                      <td className="py-4 text-center text-gray-400">R$ 4.000</td>
                      <td className="py-4 text-center text-[#FFD700] font-bold">R$ 4.250</td>
                      <td className="py-4 text-center text-green-400 font-bold">+ R$ 500</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-4 text-white font-bold">R$ 10.000</td>
                      <td className="py-4 text-center text-red-400">R$ 7.500</td>
                      <td className="py-4 text-center text-gray-400">R$ 8.000</td>
                      <td className="py-4 text-center text-[#FFD700] font-bold">R$ 8.500</td>
                      <td className="py-4 text-center text-green-400 font-bold">+ R$ 1.000</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-4 text-white font-bold">R$ 20.000</td>
                      <td className="py-4 text-center text-red-400">R$ 15.000</td>
                      <td className="py-4 text-center text-gray-400">R$ 16.000</td>
                      <td className="py-4 text-center text-[#FFD700] font-bold">R$ 17.000</td>
                      <td className="py-4 text-center text-green-400 font-bold">+ R$ 2.000</td>
                    </tr>
                    <tr className="bg-[#FFD700]/10">
                      <td className="py-4 text-white font-bold">R$ 50.000</td>
                      <td className="py-4 text-center text-red-400">R$ 37.500</td>
                      <td className="py-4 text-center text-gray-400">R$ 40.000</td>
                      <td className="py-4 text-center text-[#FFD700] font-bold text-xl">R$ 42.500</td>
                      <td className="py-4 text-center text-green-400 font-bold text-xl">+ R$ 5.000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  * Sem contar o bônus de 5% vitalício dos seus indicados
                </p>
              </div>
            </div>

            {/* Benefícios Fundador */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[#FFD700]/10 to-[#FFA500]/5 border-2 border-[#FFD700] rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#FFD700] mb-2">Taxa Vitalícia de 15%</h4>
                    <p className="text-gray-300 text-sm">
                      Economize <span className="text-[#FFD700] font-bold">5% a mais</span> que criadores normais. 
                      Para sempre. Sem aumentos futuros.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#FFD700]/10 to-[#FFA500]/5 border-2 border-[#FFD700] rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#FFD700] mb-2">Renda Passiva Vitalícia</h4>
                    <p className="text-gray-300 text-sm">
                      Ganhe <span className="text-[#FFD700] font-bold">5% de comissão</span> sobre TUDO que seus 
                      indicados faturarem. Para sempre.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setStep('mentorship')}
                className="group px-10 py-5 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold text-xl rounded-full hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-[#FFD700]/50"
              >
                Quero saber mais sobre a Renda Passiva
                <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tela 3.2: Sistema de Mentoria */}
      {step === 'mentorship' && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
          <div className="max-w-4xl w-full space-y-12">
            <div className="text-center space-y-6">
              <Crown className="w-24 h-24 text-[#FFD700] mx-auto animate-pulse" />
              <h2 className="text-4xl md:text-6xl font-bold text-[#FFD700]">
                Torne-se um Mentor Lyberhot
              </h2>
              <p className="text-2xl text-gray-300">
                Sua influência vale dinheiro
              </p>
            </div>

            {/* Visualização do Sistema de Mentoria */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#FFD700] rounded-2xl p-8 md:p-12">
              <div className="flex flex-col items-center space-y-8">
                {/* Mentor (Você) */}
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center shadow-2xl shadow-[#FFD700]/50">
                    <Crown className="w-12 h-12 text-black" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">VOCÊ</span>
                  </div>
                </div>

                {/* Linhas de Conexão */}
                <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col items-center space-y-2">
                      <div className="h-16 w-0.5 bg-gradient-to-b from-[#FFD700] to-transparent"></div>
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center border-2 border-[#FFD700]">
                        <Users className="w-8 h-8 text-[#FFD700]" />
                      </div>
                      <div className="text-center">
                        <DollarSign className="w-6 h-6 text-green-500 mx-auto" />
                        <p className="text-xs text-gray-400 mt-1">5% vitalício</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="bg-black/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-[#FFD700] mb-4">Como Funciona:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-[#FFD700] flex-shrink-0 mt-1" />
                      <p className="text-gray-300">
                        Você recebe um <span className="text-[#FFD700] font-bold">Link de Convite Exclusivo</span>
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-[#FFD700] flex-shrink-0 mt-1" />
                      <p className="text-gray-300">
                        Ganhe <span className="text-[#FFD700] font-bold">5% de comissão</span> sobre TUDO que seus indicados faturarem
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-[#FFD700] flex-shrink-0 mt-1" />
                      <p className="text-gray-300">
                        <span className="text-[#FFD700] font-bold">Vitalício</span> - renda passiva para sempre
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-[#FFD700] flex-shrink-0 mt-1" />
                      <p className="text-gray-300">
                        Sem tirar do bolso deles - <span className="text-[#FFD700] font-bold">todos ganham</span>
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setStep('dashboard')}
                className="group px-10 py-5 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold text-xl rounded-full hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-[#FFD700]/50"
              >
                Ver meu potencial de ganhos
                <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tela 3.3: Dashboard Preview */}
      {step === 'dashboard' && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
          <div className="max-w-5xl w-full space-y-12">
            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold text-[#FFD700]">
                Controle Total do Seu Império
              </h2>
              <p className="text-xl text-gray-300">
                Acompanhe suas vendas e os ganhos dos seus afilhados em tempo real
              </p>
            </div>

            {/* Mockup do Dashboard */}
            <div className="relative mx-auto max-w-sm">
              {/* Moldura do Celular */}
              <div className="relative bg-gray-900 rounded-[3rem] p-4 shadow-2xl border-8 border-gray-800">
                <div className="bg-black rounded-[2.5rem] overflow-hidden">
                  {/* Notch */}
                  <div className="h-6 bg-black flex justify-center">
                    <div className="w-32 h-6 bg-gray-900 rounded-b-2xl"></div>
                  </div>

                  {/* Conteúdo do Dashboard */}
                  <div className="p-6 space-y-6 bg-gradient-to-b from-black to-gray-900">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <Crown className="w-8 h-8 text-[#FFD700]" />
                      <span className="text-sm text-gray-400">Dashboard</span>
                    </div>

                    {/* Saldo Total */}
                    <div className="bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-2xl p-6 shadow-xl">
                      <p className="text-black/70 text-sm mb-2">Saldo Total</p>
                      <p className="text-4xl font-bold text-black">R$ 14.250,00</p>
                    </div>

                    {/* Cards de Receita */}
                    <div className="space-y-4">
                      {/* Minhas Vendas */}
                      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            <span className="text-sm text-gray-400">Minhas Vendas (85%)</span>
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-white">R$ 10.000,00</p>
                      </div>

                      {/* Comissão de Mentoria */}
                      <div className="bg-gray-800 rounded-xl p-4 border border-[#FFD700]">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Crown className="w-5 h-5 text-[#FFD700]" />
                            <span className="text-sm text-gray-400">Comissão Mentoria (5%)</span>
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-[#FFD700]">R$ 4.250,00</p>
                        <p className="text-xs text-gray-500 mt-1">De 12 indicados ativos</p>
                      </div>
                    </div>

                    {/* Estatísticas */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-800 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-white">12</p>
                        <p className="text-xs text-gray-400">Indicados</p>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-[#FFD700]">+85%</p>
                        <p className="text-xs text-gray-400">vs. Padrão</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefícios Destacados */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#FFD700] rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-[#FFD700] mb-6 text-center">
                Isso é só o começo...
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto">
                    <TrendingUp className="w-8 h-8 text-black" />
                  </div>
                  <p className="font-bold text-white">85% de Lucro</p>
                  <p className="text-sm text-gray-400">Maior taxa do mercado</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto">
                    <Crown className="w-8 h-8 text-black" />
                  </div>
                  <p className="font-bold text-white">Renda Passiva</p>
                  <p className="text-sm text-gray-400">5% vitalício dos indicados</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8 text-black" />
                  </div>
                  <p className="font-bold text-white">Suporte VIP</p>
                  <p className="text-sm text-gray-400">Atendimento prioritário</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setStep('signup')}
                className="group px-12 py-6 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold text-2xl rounded-full hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-[#FFD700]/50 animate-pulse"
              >
                QUERO MINHA VAGA DE FUNDADOR AGORA
                <ArrowRight className="inline-block ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tela Final: Cadastro */}
      {step === 'signup' && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
          <div className="max-w-2xl w-full space-y-8">
            {/* Urgência */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-600 rounded-full animate-pulse">
                <Clock className="w-6 h-6" />
                <span className="font-bold text-xl">Vaga reservada por {formatTime(timeLeft)}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#FFD700]">
                Aplicação Pré-Aprovada
              </h2>
              <p className="text-xl text-gray-300">
                Lote Fundador - Apenas {remainingSpots} vagas restantes
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#FFD700] rounded-2xl p-8 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#FFD700]">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-black border-2 border-gray-700 rounded-lg text-white focus:border-[#FFD700] focus:outline-none transition-colors"
                  placeholder="Seu nome completo"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#FFD700]">
                  WhatsApp (com DDD) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-4 py-3 bg-black border-2 border-gray-700 rounded-lg text-white focus:border-[#FFD700] focus:outline-none transition-colors"
                  placeholder="(11) 99999-9999"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#FFD700]">
                  Instagram (obrigatório para análise) *
                </label>
                <div className="flex items-center">
                  <span className="px-4 py-3 bg-gray-800 border-2 border-r-0 border-gray-700 rounded-l-lg text-gray-400">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="flex-1 px-4 py-3 bg-black border-2 border-gray-700 rounded-r-lg text-white focus:border-[#FFD700] focus:outline-none transition-colors"
                    placeholder="seu_instagram"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Benefícios Resumidos */}
              <div className="bg-black/50 rounded-xl p-6 space-y-3">
                <p className="text-sm font-bold text-[#FFD700] mb-3">Você está garantindo:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <p className="text-sm text-gray-300">Taxa de 15% vitalícia (vs. 20% padrão)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <p className="text-sm text-gray-300">5% de comissão sobre indicados (para sempre)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <p className="text-sm text-gray-300">Dashboard exclusivo em tempo real</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <p className="text-sm text-gray-300">Suporte VIP prioritário</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold text-xl rounded-full hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-[#FFD700]/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'PROCESSANDO...' : 'GARANTIR TAXA DE 15% + SISTEMA DE MENTORIA'}
              </button>

              <p className="text-xs text-center text-gray-500">
                Ao enviar, você concorda com nossos termos de uso e política de privacidade
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
