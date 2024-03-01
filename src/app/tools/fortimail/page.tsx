import BarChart from "@/components/BarChart";
import PageTitle from "@/components/PageTitle";
import Card, { CardContent, CardProps } from "@/components/card";
import { Mail, Send, MinusCircle, ShieldOff } from "lucide-react";
import SalesCard, { SalesProps } from "@/components/SalesCard";
import fs from 'fs';
import path from 'path';

// Tipagem para os dados do arquivo de SPAM
interface SpamData {
  amount: string;
}
interface VirusData {
  amount: string;
}
const cardData: CardProps[] = [
  {
    label: "Total de Email's Enviados",
    amount: 0,
    description: "analytical description",
    icon: Send
  },
  {
    label: "Total de Email's Recebidos",
    amount: 0,
    description: "analytical description",
    icon: Mail
  },
  {
    label: "Email's Spam's Bloqueados",
    amount: 0,
    description: "analytical description",
    icon: MinusCircle
  },
  {
    label: "Email's com vírus Bloqueados",
    amount: 0,
    description: "analytical description",
    icon: ShieldOff
  }
]

const userSalesData: SalesProps[] = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    salesAmount: "+$1,999.00"
  },
  {
    name: "Jackson Lee",
    email: "isabella.nguyen@email.com",
    salesAmount: "+$1,999.00"
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    salesAmount: "+$39.00"
  },
  {
    name: "William Kim",
    email: "will@email.com",
    salesAmount: "+$299.00"
  },
  {
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    salesAmount: "+$39.00"
  }
];

interface EmailData {
  amount: string;
}
const readEmailData = (dataType: 'spam' | 'virus' | 'countIn' | 'countOut'): EmailData | null => {
  try {
    const folderPath = path.join(process.cwd(), 'src', 'app', 'tools', 'fortimail', 'data');
    const files = fs.readdirSync(folderPath);

    if (files.length === 0) {
      console.error('Nenhum arquivo encontrado na pasta.');
      return null;
    }

    // Encontrar o arquivo mais recente pela data de modificação
    const latestFile = files.reduce((latest: null | { filePath: string; mtimeMs: number }, file: string) => {
      const filePath = path.join(folderPath, file);
      const fileStats = fs.statSync(filePath);

      if (!latest || fileStats.mtimeMs > latest.mtimeMs) {
        return { filePath, mtimeMs: fileStats.mtimeMs };
      }

      return latest;
    }, null);

    if (!latestFile) {
      console.error('Não foi possível determinar o arquivo mais recente.');
      return null;
    }

    const rawData = fs.readFileSync(latestFile.filePath, 'utf-8');
    const jsonData = JSON.parse(rawData);

    let quantidadeData;

    if (dataType === 'spam') {
      // Navegar pela estrutura JSON para obter a quantidade de spam
      quantidadeData = jsonData?.['fortianalyzer-report']?.charts[0]?.rows[0]?.cols[0]?.value;
    } else if (dataType === 'virus') {
      // Procurar pela entrada com "Title" igual a "Total"
      const totalEntry = jsonData?.['fortianalyzer-report']?.charts[2]?.rows.find(entry => entry.cols[0]?.name === 'Title' && entry.cols[0]?.value === 'Total');

      if (totalEntry) {
        // Pegar o valor de "amount" se a entrada for encontrada
        quantidadeData = totalEntry.cols[1]?.value;
      }
    } else if (dataType === 'countIn') {
      // Procurar pela entrada com "date" igual a "Total"
      const totalEntry = jsonData?.['fortianalyzer-report']?.charts[1]?.rows.find(entry => entry.cols[0]?.value === 'Total');

      if (totalEntry) {
        // Pegar o valor de "countIn" se a entrada for encontrada
        quantidadeData = totalEntry.cols[1]?.value;
      }
    } else if (dataType === 'countOut') {
      // Procurar pela entrada com "date" igual a "Total"
      const totalEntry = jsonData?.['fortianalyzer-report']?.charts[3]?.rows.find(entry => entry.cols[0]?.value === 'Total');

      if (totalEntry) {
        // Pegar o valor de "countOut" se a entrada for encontrada
        quantidadeData = totalEntry.cols[1]?.value;
      }
    }

    if (quantidadeData) {
      return { amount: quantidadeData };
    } else {
      console.error(`A quantidade de ${dataType} não foi encontrada no formato esperado.`);
      return null;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'ENOENT') {
        console.error('O diretório ou arquivo não foi encontrado:', (error as NodeJS.ErrnoException).path);
      } else {
        console.error('Erro ao ler o arquivo de dados:', error.message);
      }
    } else {
      console.error('Erro inesperado:', error);
    }
    return null;
  }
};

export default function Home() {
  const spamData = readEmailData('spam');
  const virusData = readEmailData('virus');
  const countIn = readEmailData('countIn');
  const countOut = readEmailData('countOut');
  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Dashboard FortiMail" />
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        {cardData.map((data, index) => {
          // Atualiza a quantidade de e-mails com SPAM se houver dados do arquivo
          if (data.label === "Email's Spam's Bloqueados" && spamData) {
            // Converte spamData.amount para número
            const numericAmount = parseFloat(spamData.amount);

            // Formata o número para exibição com 3 casas decimais
            const formattedAmount = numericAmount.toLocaleString('pt-Br', { minimumFractionDigits: 3, maximumFractionDigits: 3 });

            // Atualiza a propriedade 'amount' como uma string formatada
            data.amount = formattedAmount;

            // Remove as casas decimais adicionais, se houver
            data.amount = data.amount.replace(/[.,]000$/, '');
          }

          // Atualiza a quantidade de e-mails com Vírus se houver dados do arquivo
          if (data.label === "Email's com vírus Bloqueados" && virusData) {
            // Converte virusData.amount para número
            const numericAmount = parseFloat(virusData.amount);

            // Formata o número para exibição com 3 casas decimais
            const formattedAmount = numericAmount.toLocaleString('pt-Br', { minimumFractionDigits: 3, maximumFractionDigits: 3 });

            // Atualiza a propriedade 'amount' como uma string formatada
            data.amount = formattedAmount;

            // Remove as casas decimais adicionais, se houver
            data.amount = data.amount.replace(/[.,]000$/, '');
          }

          // Atualiza a quantidade de e-mails recebidos se houver dados do arquivo
          if (data.label === "Total de Email's Recebidos" && countIn) {
            // Converte countIn.amount para número
            const numericAmount = parseFloat(countIn.amount);

            // Formata o número para exibição com 3 casas decimais
            const formattedAmount = numericAmount.toLocaleString('pt-Br', { minimumFractionDigits: 3, maximumFractionDigits: 3 });

            // Atualiza a propriedade 'amount' como uma string formatada
            data.amount = formattedAmount;

            // Remove as casas decimais adicionais, se houver
            data.amount = data.amount.replace(/[.,]000$/, '');
          }

          // Atualiza a quantidade de e-mails enviados se houver dados do arquivo
          if (data.label === "Total de Email's Enviados" && countOut) {
            // Converte countOut.amount para número
            const numericAmount = parseFloat(countOut.amount);

            // Formata o número para exibição com 3 casas decimais
            const formattedAmount = numericAmount.toLocaleString('pt-Br', { minimumFractionDigits: 3, maximumFractionDigits: 3 });

            // Atualiza a propriedade 'amount' como uma string formatada
            data.amount = formattedAmount;

            // Remove as casas decimais adicionais, se houver
            data.amount = data.amount.replace(/[.,]000$/, '');
          }

          return (
            <Card
              key={index}
              amount={data.amount}
              description={data.description}
              icon={data.icon}
              label={data.label}
            />
          );
        })}
      </section>


      <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-2">
        <CardContent>
          <p className="p-4 font-semibold">Overview</p>
          <BarChart />
        </CardContent>
        <CardContent className="flex justify-between gap-4">
          <section>
            <p>Recent Sales</p>
            <p className="text-sm text-gray-400">
              You made 265 sales this month.
            </p>
          </section>
          {userSalesData.map((data, index) => (
            <SalesCard
              key={index}
              email={data.email}
              name={data.name}
              salesAmount={data.salesAmount}
            />
          ))}
        </CardContent>
      </section>
    </div>
  )
}