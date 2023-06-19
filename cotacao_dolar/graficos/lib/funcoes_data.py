from datetime import date
from datetime import datetime, timedelta
import holidays

feriados = holidays.Brazil()


def converter_data(data: str) -> datetime:
    """
        Converte uma data string no formato do VatComply
            em um objeto datetime

    Args:
        data (str): data no formato YYYY-mm-dd

    Returns:
        datetime: Objeto datetime pronto para ser salvo no banco de dados
    """
    return datetime.strptime(data, "%Y-%m-%d")


def checar_se_dia_util(data):
    # Checa se dia da semana (0- Segunda .. 5- Sabado, 6- Domingo)
    if data.weekday() < 5:
        # Checa se data é um feriado
        if data not in feriados:
            return True
    return False


def contar_dias_uteis(data_inicio: datetime, data_fim: datetime) -> int:

    total_dias_entre_as_datas = (data_fim - data_inicio).days + 1
    dias_uteis = 0

    for i in range(total_dias_entre_as_datas):
        data_atual = data_inicio + timedelta(days=i)

        if checar_se_dia_util(data_atual):
            dias_uteis += 1

    return dias_uteis
