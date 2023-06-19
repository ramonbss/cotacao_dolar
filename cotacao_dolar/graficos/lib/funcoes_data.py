from datetime import datetime
import holidays


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
