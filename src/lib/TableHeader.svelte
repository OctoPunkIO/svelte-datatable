<script lang="ts">
  import type { Column, SortState } from './types';
  import { createEventDispatcher } from 'svelte';

  type T = $$Generic;

  export let columns: Column<T>[] = [];
  export let sortable = true;
  export let selectable = false;
  export let sortState: SortState<T> | null = null;
  export let stickyHeader = false;
  export let allSelected = false;

  const dispatch = createEventDispatcher();

  function getSortIcon(column: Column<T>) {
    if (sortState?.column !== column) return 'unfold';
    return sortState.direction === 'asc' ? 'chevron-up' : 'chevron-down';
  }
</script>

<thead class:sticky={stickyHeader}>
  <tr>
    {#if selectable}
      <th class="select-cell">
        <input
          type="checkbox"
          checked={allSelected}
          on:change={() => dispatch('selectAll')}
          aria-label="Select all rows"
        />
      </th>
    {/if}
    {#each columns as column}
      <th
        style:width={column.width}
        style:text-align={column.align ?? 'left'}
        class:sortable={sortable && column.sortable !== false}
        on:click={() => sortable && column.sortable !== false && dispatch('sort', column)}
        on:keydown={(e) => e.key === 'Enter' && dispatch('sort', column)}
        tabindex={sortable && column.sortable !== false ? 0 : -1}
        role={sortable && column.sortable !== false ? 'button' : undefined}
        aria-sort={sortState?.column === column
          ? sortState.direction === 'asc' ? 'ascending' : 'descending'
          : undefined}
      >
        <span class="header-content">
          {column.header}
          {#if sortable && column.sortable !== false}
            <span class="sort-icon" data-icon={getSortIcon(column)} />
          {/if}
        </span>
      </th>
    {/each}
  </tr>
</thead>

<style>
  thead {
    background: var(--dt-header-bg, #f6f8fa);
    border-bottom: 1px solid var(--dt-border-color, #e1e4e8);
  }

  thead.sticky {
    position: sticky;
    top: 0;
    z-index: 1;
  }

  th {
    padding: var(--dt-cell-padding, 12px 16px);
    font-weight: 600;
    text-align: left;
    white-space: nowrap;
  }

  th.sortable {
    cursor: pointer;
    user-select: none;
  }

  th.sortable:hover {
    background: var(--dt-header-hover-bg, #eaeef2);
  }

  .header-content {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .select-cell {
    width: 40px;
    text-align: center;
  }
</style>