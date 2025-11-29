import matplotlib.pyplot as plt
import pandas as pd
from collections import Counter
import numpy as np
import matplotlib
import platform
from chart_utils import matplotlib_fig_to_base64

try:
    if platform.system() == 'Windows':
        matplotlib.rcParams['font.family'] = ['Arial', 'DejaVu Sans']
    else:
        matplotlib.rcParams['font.family'] = ['DejaVu Sans', 'Arial Unicode MS', 'sans-serif']
except:
    pass

matplotlib.rcParams['axes.unicode_minus'] = False
plt.rcParams['font.size'] = 10

SENTIMENT_LABELS = {
    'positive': 'Положительные',
    'negative': 'Негативные',
    'neutral': 'Нейтральные'
}

PASTEL_COLORS = {
    'positive': '#a8e6cf',      # Пастельный зеленый
    'negative': '#ffb3ba',      # Пастельный розовый
    'neutral': '#d3d3d3',       # Пастельный серый
    'topics': ['#bae1ff', '#ffdfba', '#ffffba', '#baffc9', '#ffb3ba'],  # Пастельные цвета для тем
    'topics_light': '#c7ecee'   # Пастельный голубой для общей диаграммы тем
}


def plot_sentiment_pie_chart(df, save_path=None, show=True):
    sentiment_counts = df['sentiment'].value_counts()
    
    colors = PASTEL_COLORS
    
    labels = []
    sizes = []
    chart_colors = []
    
    for sentiment in ['positive', 'negative', 'neutral']:
        if sentiment in sentiment_counts:
            labels.append(SENTIMENT_LABELS.get(sentiment, sentiment.capitalize()))
            sizes.append(sentiment_counts[sentiment])
            chart_colors.append(colors[sentiment])
    
    fig, ax = plt.subplots(figsize=(8, 8))
    wedges, texts, autotexts = ax.pie(
        sizes, 
        labels=labels, 
        colors=chart_colors,
        autopct='%1.1f%%',
        startangle=90,
        textprops={'fontsize': 12, 'weight': 'bold'}
    )
    
    for autotext in autotexts:
        autotext.set_color('#333333')
        autotext.set_fontsize(11)
        autotext.set_weight('bold')
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"Диаграмма сохранена: {save_path}")
    
    if show:
        plt.show()
    else:
        plt.close()


def plot_topics_bar_chart(df, save_path=None, show=True):
    topic_counts = Counter()
    for topic_str in df['topic']:
        topic_list = [t.strip() for t in str(topic_str).split(",")]
        for topic in topic_list:
            topic_counts[topic] += 1
    
    topics_sorted = sorted(topic_counts.items(), key=lambda x: x[1], reverse=True)
    topics, counts = zip(*topics_sorted) if topics_sorted else ([], [])
    
    fig, ax = plt.subplots(figsize=(10, 6))
    bar_colors = [PASTEL_COLORS['topics'][i % len(PASTEL_COLORS['topics'])] for i in range(len(topics))]
    bars = ax.bar(topics, counts, color=bar_colors, alpha=0.85, 
                 edgecolor='white', linewidth=1.5)
    
    ax.set_xlabel('Темы', fontsize=12, fontweight='bold')
    ax.set_ylabel('Количество упоминаний', fontsize=12, fontweight='bold')
    
    plt.xticks(rotation=45, ha='right')
    
    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{int(height)}',
                ha='center', va='bottom', fontsize=10)
    
    plt.grid(axis='y', alpha=0.3, linestyle='--')
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"Диаграмма сохранена: {save_path}")
    
    if show:
        plt.show()
    else:
        plt.close()


def plot_topics_by_sentiment(df, output_dir=None, show=True):
    if output_dir is None:
        output_dir = ""
    elif output_dir and not output_dir.endswith('/') and not output_dir.endswith('\\'):
        output_dir += "/"
    
    sentiments = df['sentiment'].unique()
    
    colors = PASTEL_COLORS
    
    all_topics = set()
    for topic_str in df['topic']:
        topic_list = [t.strip() for t in str(topic_str).split(",")]
        all_topics.update(topic_list)
    
    all_topics = sorted(list(all_topics))
    
    for sentiment in ['positive', 'negative', 'neutral']:
        if sentiment not in sentiments:
            continue
        
        sentiment_df = df[df['sentiment'] == sentiment]
        
        topic_counts = Counter()
        for topic_str in sentiment_df['topic']:
            topic_list = [t.strip() for t in str(topic_str).split(",")]
            for topic in topic_list:
                topic_counts[topic] += 1
        
        counts = [topic_counts.get(topic, 0) for topic in all_topics]
        
        fig, ax = plt.subplots(figsize=(10, 6))
        x_pos = range(len(all_topics))
        bars = ax.bar(x_pos, counts, color=colors[sentiment], alpha=0.85, 
                     edgecolor='white', linewidth=1.5)
        
        ax.set_xlabel('Темы', fontsize=12, fontweight='bold')
        ax.set_ylabel('Количество', fontsize=12, fontweight='bold')
        
        ax.set_xticks(x_pos)
        ax.set_xticklabels(all_topics, rotation=0, ha='center')
        
        for bar in bars:
            height = bar.get_height()
            if height > 0:
                ax.text(bar.get_x() + bar.get_width()/2., height,
                       f'{int(height)}',
                       ha='center', va='bottom', fontsize=10)
        
        ax.grid(axis='y', alpha=0.3, linestyle='--')
        plt.tight_layout()
        
        save_path = f"{output_dir}topics_by_{sentiment}.png"
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"Диаграмма сохранена: {save_path}")
        
        if show:
            plt.show()
        else:
            plt.close()


def create_all_visualizations(df, output_dir=None, show=True):
    if output_dir is None:
        output_dir = ""
    elif output_dir and not output_dir.endswith('/') and not output_dir.endswith('\\'):
        output_dir += "/"
    
    print("\n" + "=" * 80)
    print("СОЗДАНИЕ ДИАГРАММ")
    print("=" * 80)
    
    print("\n[1/5] Создание круговой диаграммы тональностей...")
    plot_sentiment_pie_chart(df, 
                            save_path=f"{output_dir}sentiment_pie_chart.png" if output_dir else "sentiment_pie_chart.png",
                            show=show)
    
    print("\n[2/5] Создание столбцовой диаграммы тем...")
    plot_topics_bar_chart(df,
                         save_path=f"{output_dir}topics_bar_chart.png" if output_dir else "topics_bar_chart.png",
                         show=show)
    
    print("\n[3-5/5] Создание столбцовых диаграмм тем по тональности...")
    plot_topics_by_sentiment(df, output_dir=output_dir, show=show)
    
    print("\n" + "=" * 80)
    print("Все диаграммы созданы!")
    print("=" * 80)


def create_all_visualizations_base64(df, show=False):
    charts = {}
    
    sentiment_counts = df['sentiment'].value_counts()
    colors = PASTEL_COLORS
    
    labels = []
    sizes = []
    chart_colors = []
    
    for sentiment in ['positive', 'negative', 'neutral']:
        if sentiment in sentiment_counts:
            labels.append(SENTIMENT_LABELS.get(sentiment, sentiment.capitalize()))
            sizes.append(sentiment_counts[sentiment])
            chart_colors.append(colors[sentiment])
    
    fig, ax = plt.subplots(figsize=(8, 8))
    wedges, texts, autotexts = ax.pie(
        sizes, labels=labels, colors=chart_colors,
        autopct='%1.1f%%', startangle=90,
        textprops={'fontsize': 12, 'weight': 'bold'}
    )
    
    for autotext in autotexts:
        autotext.set_color('#333333')
        autotext.set_fontsize(11)
        autotext.set_weight('bold')
    
    charts['sentiment_pie'] = matplotlib_fig_to_base64(fig)
    if show:
        plt.show()
    else:
        plt.close(fig)
    
    from collections import Counter
    topic_counts = Counter()
    for topic_str in df['topic']:
        topic_list = [t.strip() for t in str(topic_str).split(",")]
        for topic in topic_list:
            topic_counts[topic] += 1
    
    topics_sorted = sorted(topic_counts.items(), key=lambda x: x[1], reverse=True)
    topics, counts = zip(*topics_sorted) if topics_sorted else ([], [])
    
    fig, ax = plt.subplots(figsize=(10, 6))
    # Используем разные пастельные цвета для каждого столбца
    bar_colors = [PASTEL_COLORS['topics'][i % len(PASTEL_COLORS['topics'])] for i in range(len(topics))]
    bars = ax.bar(topics, counts, color=bar_colors, alpha=0.85, 
                 edgecolor='white', linewidth=1.5)
    ax.set_xlabel('Темы', fontsize=12, fontweight='bold')
    ax.set_ylabel('Количество упоминаний', fontsize=12, fontweight='bold')
    plt.xticks(rotation=45, ha='right')
    
    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{int(height)}',
                ha='center', va='bottom', fontsize=10)
    
    plt.grid(axis='y', alpha=0.3, linestyle='--')
    plt.tight_layout()
    charts['topics_bar'] = matplotlib_fig_to_base64(fig)
    if show:
        plt.show()
    else:
        plt.close(fig)
    
    all_topics = set()
    for topic_str in df['topic']:
        topic_list = [t.strip() for t in str(topic_str).split(",")]
        all_topics.update(topic_list)
    all_topics = sorted(list(all_topics))
    
    for sentiment in ['positive', 'negative', 'neutral']:
        if sentiment not in df['sentiment'].unique():
            continue
        
        sentiment_df = df[df['sentiment'] == sentiment]
        topic_counts = Counter()
        for topic_str in sentiment_df['topic']:
            topic_list = [t.strip() for t in str(topic_str).split(",")]
            for topic in topic_list:
                topic_counts[topic] += 1
        
        counts = [topic_counts.get(topic, 0) for topic in all_topics]
        
        fig, ax = plt.subplots(figsize=(10, 6))
        x_pos = range(len(all_topics))
        bars = ax.bar(x_pos, counts, color=colors[sentiment], alpha=0.85, 
                     edgecolor='white', linewidth=1.5)
        ax.set_xlabel('Темы', fontsize=12, fontweight='bold')
        ax.set_ylabel('Количество', fontsize=12, fontweight='bold')
        ax.set_xticks(x_pos)
        ax.set_xticklabels(all_topics, rotation=0, ha='center')
        
        for bar in bars:
            height = bar.get_height()
            if height > 0:
                ax.text(bar.get_x() + bar.get_width()/2., height,
                       f'{int(height)}',
                       ha='center', va='bottom', fontsize=10)
        
        ax.grid(axis='y', alpha=0.3, linestyle='--')
        plt.tight_layout()
        
        charts[f'topics_{sentiment}'] = matplotlib_fig_to_base64(fig)
        if show:
            plt.show()
        else:
            plt.close(fig)
    
    return charts

